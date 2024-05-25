import mongoose from "mongoose";
import { CONFIG } from "@/config/config";

const MONGO_URI = CONFIG.MONGO.connectionString;

if (!MONGO_URI) {
	throw new Error("Please define correct connection string and check environment variables inside .env.local");
}

declare global {
	var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
	if (cached.connection) {
		return cached.connection;
	}
	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
			return mongoose;
		});
	}
	try {
		console.log("Connecting to MongoDB...");
		cached.connection = await cached.promise;
		console.log("Connected.");
		return cached.connection;
	} catch (e) {
		cached.promise = undefined;
		console.log("There was an error connecting to the database. Error: " + e);
	}
}

async function checkConnection() {
	if (mongoose.connection.readyState <= 1) {
		await connect();
	}
}

export { checkConnection };
export default connect;
