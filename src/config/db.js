import mongoose from "mongoose";
import { appConfig } from "./appConfig.js";

const connect = async () => {
  await mongoose
    .connect(appConfig.mongoUrl)
    .then(() => {
      console.log(
        "----------------------------------------------------------------",
      );
      console.log("connected to db");
      console.log(
        "----------------------------------------------------------------",
      );
    })
    .catch((err) => {
      console.log(
        "----------------------------------------------------------------",
      );
      console.log("Mongo error: " + err.message);
    
      console.log(
        "----------------------------------------------------------------",
      );
      process.exit(1);
    });
};

export default connect;
