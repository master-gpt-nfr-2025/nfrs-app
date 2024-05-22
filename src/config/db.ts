import mongoose from "mongoose";
import { CONFIG } from "@/config/config";

const MONGO_URI = CONFIG.MONGO.connectionString;

const cached: { connection?: typeof mongoose; promise?: Promise<typeof mongoose> } = {};

async function connect() {
	if (!MONGO_URI) {
		throw new Error("Please define correct connection string and check environment variables inside .env.local");
	}

	if (cached.connection) {
		return cached.connection;
	}
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};
		cached.promise = mongoose.connect(MONGO_URI, opts);
	}
	try {
		console.log("Connecting to MongoDB...");
		cached.connection = await cached.promise;
		console.log("Connected.");
	} catch (e) {
		cached.promise = undefined;
		console.log("There was an error connecting to the database. Error: " + e);
		throw e;
	}
	return cached.connection;
}

async function checkConnection() {
	if (mongoose.connection.readyState <= 1) {
		await connect();
	}
}

export { checkConnection };
export default connect;
