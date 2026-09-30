import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import productRoutes from "./routes/products";
import analyticsRoutes from "./routes/analytics";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });
export const prisma = new PrismaClient();

// CORS
fastify.register(cors, {
  origin: [
    "http://localhost:3000",
    "https://electronicreview.com",
    "https://www.electronicreview.com",
  ],
  credentials: true,
});

// Routes
fastify.register(productRoutes, { prefix: "/api/products" });
fastify.register(analyticsRoutes, { prefix: "/api/analytics" });

// Health check
fastify.get("/health", async (request, reply) => {
  return { status: "ok" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("✅ API corriendo en puerto 3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();