const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
// const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const morgan = require("morgan");

dotenv.config({ path: "./.env" });

connectDB();

const auth = require("./routes/auth");
const nft = require("./routes/nftProfile");
const user = require("./routes/user-profile");
const validator = require("./routes/validator-profile");
const nftValation = require("./routes/nftForValidation");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
    },
  })
);

app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());
app.use(cors());

// app.use(errorHandler);
// User Login
app.use("/auth", auth);
app.use("/api/nft", nft);
app.use("/api/user", user);
app.use("/api/validator", validator);
app.use("/api/nftValidation", nftValation);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Aconomy application." });
});

const PORT = process.env.PORT || 4000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
