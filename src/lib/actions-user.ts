"use server";

import { revalidatePath } from "next/cache";
import User from "@/models/user.model";

export async function createUser(name: string) {
	try {
		const user = await User.create({ name });
		revalidatePath("/");
		return { id: user._id.toString(), name: user.name };
	} catch (error) {
		console.error("Failed to create user:", error);
		throw new Error("Failed to create user");
	}
}
