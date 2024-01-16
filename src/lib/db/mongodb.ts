import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { db } from "@/config/env";

declare global {
  namespace globalThis {
    const _mongoClientPromise: Promise<MongoClient>;
  }
  const mongoose: any;
}

const MONGODB_URI: string =
  `${db.MONGODB_URI}/${db.DATABASE_NAME}${
    db.MONGODB_CONFIG && "?" + db.MONGODB_CONFIG
  }` ?? "";
if (!MONGODB_URI || !db.MONGODB_URI || !db.DATABASE_NAME) {
  throw new Error("Mongo URI not found!");
}

const gloablWithMongoose: any = (global as typeof globalThis) && {
  mongoose,
};

let cached: any = gloablWithMongoose.mongoose;
if (!cached) {
  cached = gloablWithMongoose.mongoose = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    return;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // https://mongoosejs.com/docs/connections.html#connection-events
    [
      "connecting",
      "connected",
      "open",
      "disconnecting",
      "disconnected",
      "close",
      "reconnected",
      "error",
    ].forEach((event) => {
      mongoose.connection.on(event, () =>
        console.log(`💥 ~ DB Event: ${event}`)
      );
    });

    cached.conn = await cached.promise;
    console.log("🚀 ~ MongoDB Connected!");
  } catch (error) {
    cached.promise = null;
    console.log("💥 ~ connect ~ error:", error);
  }

  return cached.conn;
}

export function state() {
  return mongoose.connection.readyState;
}

export async function disconnect() {
  try {
    await mongoose.connection.close();
    console.log("🔥 ~ MongoDB Disconnected!");
  } catch (error) {
    console.log("💥 ~ disconnect ~ error:", error);
  }
}
