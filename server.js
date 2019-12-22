const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
// bring routes
const userRoutes = require("./routes/user");

// app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connected"));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
// cors
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// api documentation
app.use('/api/docs', express.static("doc"))

// routes middleware
app.use("/api/blog", require("./routes/blog"));
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1", userRoutes);
app.use("/api/v1", require("./routes/category"));
app.use("/api/v1", require("./routes/tag"));
app.use("/api/v1/agency", require("./routes/agency"));

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
