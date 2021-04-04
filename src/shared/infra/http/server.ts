import { connection } from "@shared/infra/typeorm";

import { app } from "./app";

connection();

app.listen(3333, () => console.log("Server is running!"));
