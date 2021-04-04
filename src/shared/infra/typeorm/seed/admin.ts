import { hash } from "bcrypt";
import { v4 as uuid } from "uuid";

import { connection } from "..";

async function create() {
  const db = await connection();

  const id = uuid();
  const password = await hash("admin", 8);

  await db.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at)
     values('${id}', 'admin', 'admin@rentx.com.be', '${password}', true, 'ADCD123', 'now()')
    `
  );

  await db.close();
}

create().then(() => console.log("User admin created!"));
