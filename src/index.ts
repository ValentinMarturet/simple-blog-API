import { PrismaClient } from "@prisma/client";
import express, { application, Request, Response } from "express";

const prisma = new PrismaClient();
const app: express.Application = express();

app.use(express.json());

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
);
