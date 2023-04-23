const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");
const corsoptions = require("./config/CorsOptions");

app.use(cors(corsoptions));

app.use(express.json());

app.route("/").get((req, res) => {
  res.send("running");
});
app.use("/datacall", require("./middleware/ocr_middleware"));

app.use("/videocall", require("./middleware/Youtube_middleware"));

app.listen(PORT, () => {
  console.log(`Server running in port:${PORT}`);
});
