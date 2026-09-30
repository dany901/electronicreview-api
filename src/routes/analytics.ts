import { FastifyInstance } from "fastify";
import { prisma } from "../index";

export default async function analyticsRoutes(fastify: FastifyInstance) {
  // GET estadísticas generales
  fastify.get("/dashboard", async (request, reply) => {
    const totalClicks = await prisma.click.count();
    const totalProducts = await prisma.product.count();

    const topProducts = await prisma.product.findMany({
      orderBy: { clicksRegistrados: "desc" },
      take: 5,
      select: {
        id: true,
        nombre: true,
        clicksRegistrados: true,
        categoria: true,
      },
    });

    const clicksByCategory = await prisma.product.groupBy({
      by: ["categoria"],
      _sum: {
        clicksRegistrados: true,
      },
    });

    return {
      totalClicks,
      totalProducts,
      topProducts,
      clicksByCategory,
    };
  });

  // GET clicks por producto (últimos 30 días)
  fastify.get("/producto/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const days = 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const clicks = await prisma.click.findMany({
      where: {
        productId: id,
        createdAt: {
          gte: since,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const dailyClicks = Array(days)
      .fill(0)
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dayClicks = clicks.filter((c) => {
          const clickDate = new Date(c.createdAt);
          clickDate.setHours(0, 0, 0, 0);
          return clickDate.getTime() === date.getTime();
        });

        return {
          date: date.toISOString().split("T")[0],
          clicks: dayClicks.length,
        };
      });

    return {
      totalClicks: clicks.length,
      dailyClicks: dailyClicks.reverse(),
      clicks,
    };
  });

  // GET clicks últimos 7 días
  fastify.get("/recent", async (request, reply) => {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const clicks = await prisma.click.findMany({
      where: {
        createdAt: {
          gte: since,
        },
      },
      include: {
        product: {
          select: {
            nombre: true,
            categoria: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return clicks;
  });
}