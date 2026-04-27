const express = require('express');
const app = express();
const cors = require("cors");
const path = require("path");

const dbConnection = require("./config/connnectDb");
const router = require("./routes/showtasks");
// const router = require("../src/routes/showtasks");


app.use(express.urlencoded({ extended: true })),
    app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", router);

// const port = process.env.PORT;
const port = 5000;

app.listen(port, () => {
    console.log(`App working at port at http://localhost:${port}`);
});
module.exports = router;