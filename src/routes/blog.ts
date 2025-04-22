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


  blogRouter.post("/", (c) => {
    return c.json("Hello");
  });
  
  blogRouter.put("/", (c) => {
    return c.json("Hello");
  });
  
  blogRouter.get("/", (c) => {
    return c.json("Hello");
  });
  
  blogRouter.get("/bulk", (c) => {
    return c.json("Hello");
  });