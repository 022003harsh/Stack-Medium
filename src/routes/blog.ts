import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { env } from "hono/adapter";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

blogRouter.post("/*", async (c, next) => {
  await next();
});

blogRouter.post("/", (c) => {
  return c.json("Hello");
});

blogRouter.put("/", (c) => {
  return c.json("Hello");
});

blogRouter.get("/", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: env(c).DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const findUser = await prisma.user.findFirst({
      where: {
        id: body.id,
      },
    });
    return c.json(findUser);
  } catch (e) {
    console.error("blog fetch error:", e);
    c.status(411);
    return c.json({
      success: false,
      message: "Error while fetching blog post",
    });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: env(c).DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const findUser = await prisma.user.findMany();
    return c.json(findUser);
  } catch (e) {
    console.error("fetch all blog error:", e);
    c.status(411);
    return c.json({
      success: false,
      message: "Error while fetching all blog post",
    });
  }
});
