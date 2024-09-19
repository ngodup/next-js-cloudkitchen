import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const db = await mongoose.connect(MONGODB_URI);
      connection.isConnected = db.connections[0].readyState;
      return;
    } catch (error) {
      console.error(
        `Database connection attempt ${retries + 1} failed:`,
        error
      );
      retries++;
      if (retries === MAX_RETRIES) {
        console.error(
          "Max retries reached. Unable to connect to the database."
        );
        throw new Error(
          "Failed to connect to the database after multiple attempts"
        );
      }
      // Wait for 5 seconds before trying again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

export default dbConnect;
