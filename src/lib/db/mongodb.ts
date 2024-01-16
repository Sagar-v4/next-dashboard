import mongoose from "mongoose";
import { db } from "@/config/env";
import { MongoClient } from "mongodb";

declare global {
  namespace globalThis {
    var _mongoClientPromise: Promise<MongoClient>;
  }
  var mongoose: any;
}

const MONGODB_URI: string = db.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Mongo URI not found!");
}

let gloablWithMongoose: any = (global as typeof globalThis) && {
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
