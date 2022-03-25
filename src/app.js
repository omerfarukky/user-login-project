const express = require("express");
const config = require("./config");
const loaders = require("./loaders");
const events = require("./scripts/events");
const { UserRoute } = require("./api-routes");

config();
loaders();
events();

const app = express();
app.use(express.json());

app.listen(process.env.APP_PORT, () => {
  console.log("Server calisti.");
  app.use("/users", UserRoute);
});
