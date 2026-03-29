const express = require('express');
const app = express();
const cors = require("cors");

const dbConnection = require("../src/config/connnectDb");
const router = require("../src/routes/showtasks");

app.use(express.urlencoded({ extended: true })),
    app.use(express.json());
app.use(cors());

app.use("/", router);

// const port = process.env.PORT;
const port = 5000;

app.listen(port, () => {
    console.log(`App working at port at http://localhost:${port}`);
});
module.exports = router;