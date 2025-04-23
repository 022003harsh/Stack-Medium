import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { env } from "hono/adapter";



export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
  }>();



userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  console.log("Request Body:", body);

  // The bellow line is to be used in every route as it is or either we can make the middleware of it and reuse it in every route because we cannot put it in the root directory
  const prisma = new PrismaClient({
    datasourceUrl: env(c).DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    console.log(env(c).DATABASE_URL);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });
    const jwt = await sign(
      {
        id: user.id,
      },
      env(c).JWT_SECRET
    );

    console.log(jwt);
    return c.json({ success: true, message: "User created successfully" });
  } catch (e) {
    console.error("Signup error:", e);
    c.status(411);
    return c.json({ success: false, message: "Server error in signup" });
  }
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  console.log("Request Body:", body);

  // The bellow line is to be used in every route as it is or either we can make the middleware of it and reuse it in every route because we cannot put it in the root directory
  const prisma = new PrismaClient({
    datasourceUrl: env(c).DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    console.log(env(c).DATABASE_URL);
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (!user) {
      c.status(403);
      return c.json({
        success: false,
        message: "User not found or incorrect credentials",
      });
    }
    const jwt = await sign(
      {
        id: user.id,
      },
      env(c).JWT_SECRET
    );

    console.log(jwt);
    return c.json({ success: true, message: "User SignedIn Successfully" });
  } catch (e) {
    console.error("Signin error:", e);
    c.status(411);
    return c.json({ success: false, message: "Server error in signin" });
  }
});