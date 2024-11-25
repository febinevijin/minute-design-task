import express from "express";
import { appConfig } from "./config/appConfig.js";
import dbConnect from "./config/db.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import indexRouter from "./router/index.js";



const app = express();

await dbConnect();

const whitelist = appConfig.whitelist.split(",");
app.set("trust proxy", 1); // trust first proxy

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      // for mobile app and postman client
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  express.json({
    type: ["application/json", "text/plain"],
  }),
);
app.use(helmet());
app.use(morgan("tiny"));

// -------------router------------------
app.use("/api/v1", indexRouter);
// ----------------------------------------

// --------------middleware----------------
app.use(notFound);
app.use(errorHandler);
// -----------------------------------------

const PORT = appConfig.port;

app.listen(PORT, () => {
  console.log(
    "----------------------------------------------------------------",
  );
  console.log("listening on port " + PORT);
  console.log(
    "----------------------------------------------------------------",
  );
});
