import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { env } from "hono/adapter";
import {
  createBlogInput,
  updateBlogInput,
} from "@tech_slayer/stack-medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.post("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || ""; // we used empty string when no token is provided
  try {
    const user = (await verify(authHeader, c.env.JWT_SECRET)) as { id: string }; // type assertion
    // verify is used when only that person can decode who has JWT_SECRET but decoding anyone can do
    if (user) {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "You are not logged in",
      });
    }
  } catch (e) {
    c.status(403);
    return c.json({
      message: "You are not logged in",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "Invalid inputs in create blog" });
  }
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: env(c).DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(authorId),
      },
    });
    return c.json({ id: blog.id });
  } catch (e) {
    console.log(e);
    return c.json({
      message: "Blog not created",
    });
  }
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ error: "Invalid inputs in updating blog" });
    }
  const prisma = new PrismaClient({
    datasourceUrl: env(c).DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blog = await prisma.blog.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({ id: blog.id });
  } catch (e) {
    console.log(e);
    return c.json({
      message: "Blog not found",
    });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: env(c).DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const findAllBlog = await prisma.blog.findMany();
    return c.json(findAllBlog);
  } catch (e) {
    console.error("fetch all blog error:", e);
    c.status(411);
    return c.json({
      success: false,
      message: "Error while fetching all blog post",
    });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: env(c).DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const findBlog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      },
    });
    return c.json(findBlog);
  } catch (e) {
    console.error("blog fetch error:", e);
    c.status(411);
    return c.json({
      success: false,
      message: "Error while fetching blog post",
    });
  }
});
