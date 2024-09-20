const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const keyRoutes = require("./routes/keyRoutes");

app.use(bodyParser.json());
app.use("/keys", keyRoutes);

app.listen(3001, () => {
  console.log("Server is listening!");
});
