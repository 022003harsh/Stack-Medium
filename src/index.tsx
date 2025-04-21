import { Hono } from "hono";
import { renderer } from "./renderer";

const app = new Hono();

app.use(renderer);

app.post("/api/v1/user/signup", (c) => {
  return c.render(<h1>Hello!</h1>);
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