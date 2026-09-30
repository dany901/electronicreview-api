import { FastifyInstance } from "fastify";
import { prisma } from "../index";

export default async function productRoutes(fastify: FastifyInstance) {
  // GET todos los productos
  fastify.get("/", async (request, reply) => {
    const { categoria, sortBy } = request.query as {
      categoria?: string;
      sortBy?: "rating" | "clicks" | "newest";
    };

    const where = categoria ? { categoria } : {};
    let orderBy: any = { createdAt: "desc" };

    if (sortBy === "rating") orderBy = { rating: "desc" };
    if (sortBy === "clicks") orderBy = { clicksRegistrados: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        reviews: {
          select: { rating: true },
        },
      },
    });

    return products;
  });

  // GET un producto por ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: true,
        clicks: {
          select: { createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 100,
        },
      },
    });

    if (!product) {
      return reply.status(404).send({ error: "Producto no encontrado" });
    }

    return product;
  });

  // POST nuevo producto
  fastify.post("/", async (request, reply) => {
    const {
      nombre,
      descripcion,
      precioAmazon,
      linkAfiliado,
      imagen,
      categoria,
      rating,
      resena,
      especsTecnicos,
      ventajas,
      desventajas,
    } = request.body as any;

    const product = await prisma.product.create({
      data: {
        nombre,
        descripcion,
        precioAmazon,
        linkAfiliado,
        imagen,
        categoria,
        rating,
        resena,
        especsTecnicos,
        ventajas,
        desventajas,
      },
    });

    return reply.status(201).send(product);
  });

  // PUT actualizar producto
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return product;
  });

  // DELETE producto
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.product.delete({
      where: { id },
    });

    return { success: true };
  });

  // POST registrar click en producto
  fastify.post("/:id/click", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { referer } = request.body as any;

    // Registrar click
    await prisma.click.create({
      data: {
        productId: id,
        referer,
        userAgent: request.headers["user-agent"],
      },
    });

    // Incrementar contador
    await prisma.product.update({
      where: { id },
      data: { clicksRegistrados: { increment: 1 } },
    });

    return { success: true };
  });
}