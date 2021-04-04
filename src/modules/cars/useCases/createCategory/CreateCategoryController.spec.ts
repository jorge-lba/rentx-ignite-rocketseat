import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "@shared/infra/http/app";
import { connection } from "@shared/infra/typeorm";

describe("Create Category Controller", () => {
  let db: Connection;
  beforeAll(async () => {
    db = await connection();
    await db.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await db.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at)
     values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'ADCD123', 'now()')
    `
    );
  });

  afterAll(async () => {
    await db.dropDatabase();
    await db.close();
  });

  it("should be able to create a new category", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new category with name exists", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
