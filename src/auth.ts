import NextAuth from "next-auth";
import { MongoClient } from "mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

import { db } from "@/config/env";
import authConfig from "@/auth.config";

const client = new MongoClient(db.MONGODB_URI);
const clientPromise = client.connect();

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  ...authConfig,
});
