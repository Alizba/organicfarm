import mongoose from "mongoose";

export async function connect() {
  try {
    if (mongoose.connections[0].readyState) return; 

    await mongoose.connect(process.env.MONGO_URL); 

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    connection.on("error", (err) => {
      console.log(
        "MongoDB connection error, please make sure DB is up and running:",
        err
      );
      process.exit(1);
    });
  } catch (e) {
    console.log("Something went wrong with DB connection:", e);
    process.exit(1);
  }
}