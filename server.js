const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");
const app = express();
require("dotenv").config();

// connect to database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((db) => console.log("db_terhubung"))
  .catch((err) => console.log(err));

// membawa ke routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");
const invoiceRoutes = require("./routes/invoice");

// apiDocs
app.get("/api", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors()); // allows all origins
if ((process.env.NODE_ENV = "development")) {
  app.use(
    cors({
      origin: `http://localhost:3000`,
    })
  );
}
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", categoryRoutes);
app.use("/", productRoutes);
app.use("/", braintreeRoutes);
app.use("/", orderRoutes);
app.use("/", invoiceRoutes);
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      error: "Unauthorized!",
    });
  }
});

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "pug");

// run app
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API is running in port ${port} - ${process.env.NODE_ENV}`);
});
