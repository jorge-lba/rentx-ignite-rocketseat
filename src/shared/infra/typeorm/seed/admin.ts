import { hash } from "bcrypt";
import { createConnection } from "typeorm";
import { v4 as uuid } from "uuid";

async function create() {
  const connection = await createConnection();

  const id = uuid();
  const password = await hash("admin", 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at)
     values('${id}', 'admin', 'admin@rentx.com.be', '${password}', true, 'ADCD123', 'now()')
    `
  );

  await connection.close();
}

create().then(() => console.log("User admin created!"));
