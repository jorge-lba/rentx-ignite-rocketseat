import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "@shared/infra/http/app";
import { connection } from "@shared/infra/typeorm";

describe("List Categories", () => {
  let db: Connection;
  beforeAll(async () => {
    db = await connection();
    await db.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await db.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at)
     values('${id}', 'admin2', 'admin2@rentx.com.br', '${password}', true, 'ADCD123', 'now()')
    `
    );
  });

  afterAll(async () => {
    await db.dropDatabase();
    await db.close();
  });

  it("should be able to list all categories", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin2@rentx.com.br",
      password: "admin",
    });

    const { refresh_token } = responseToken.body;

    await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Supertest",
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toEqual("Category Supertest");
  });
});
