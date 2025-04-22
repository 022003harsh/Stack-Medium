import { Hono } from "hono";
import { renderer } from "./renderer";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";
import { decode, sign, verify } from "hono/jwt";

// define the type of HONO
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use(renderer);

app.get("/db", (c) => {
  const { DATABASE_URL } = env(c);
  return c.text(DATABASE_URL);
  // return c.text(`DATABASE_URL is: ${c.env.DATABASE_URL}`);
});

app.post("/api/v1/user/signup", async (c) => {
  const body = await c.req.json();
  console.log("Request Body:", body);

  // The bellow line is to be used in every route as it is or either we can make the middleware of it and reuse it in every route because we cannot put it in the root directory
  const prisma = new PrismaClient({
    datasourceUrl: env(c).DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    console.log("aa gaie");
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
    return c.json({ success: false, message: "Server error" });
  }
});

app.post("/api/v1/user/signin", (c) => {
  return c.render(<h1>Hello!</h1>);
});

app.post("/api/v1/blog", (c) => {
  return c.render(<h1>Hello!</h1>);
});

app.put("/api/v1/blog", (c) => {
  return c.render(<h1>Hello!</h1>);
});

app.get("/api/v1/blog", (c) => {
  return c.render(<h1>Hello!</h1>);
});

app.get("/api/v1/blog/blog", (c) => {
  return c.render(<h1>Hello!</h1>);
});

export default app;
