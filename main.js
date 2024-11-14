// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

// database connection
mongoose.set("strictQuery", true); // err
mongoose.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (error) => {
  console.log(error);
  throw error;
});
db.once("open", () => {
  console.log("connect to the database!");
});
//middlewares

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("uploads"));

// set templete engine
app.set("view engine", "ejs");

app.use("", require("./routes/routes.js"));

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
