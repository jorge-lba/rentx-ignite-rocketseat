import { Router } from "express";
import { v4 as uuid } from "uuid";

const categoriesRoutes = Router();

const categories = [];

categoriesRoutes.post("/", (request, response) => {
  const { name, description } = request.body;

  const category = { uuid: uuid(), name, description };

  categories.push(category);

  return response.status(201).send();
});

export { categoriesRoutes };
