import { PrismaClient } from "@prisma/client";
import express, { application, Request, Response } from "express";

const prisma = new PrismaClient();
const app: express.Application = express();

app.use(express.json());

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/feed", async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json(posts);
});

app.get("/post/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await prisma.post.findFirst({
    where: { id: Number(id) },
  });
  res.json(post);
});

app.post("/user", async (req: Request, res: Response) => {
  const result = await prisma.user.create({
    data: { ...req.body },
  });
  res.json(result);
});

app.post("/post", async (req: Request, res: Response) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  });
  res.json(result);
});

app.put("/post/publish/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });
  res.json(post);
});

app.delete("/post/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: { id: Number(id) },
  });
  res.json(post);
});

app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
);
