import { NextRequest, NextResponse } from "next/server";
import { checkConnection } from "@/config/db";
import Subcategory from "@/models/subcategory.model";
import Category from "@/models/category.model";
import mongoose from "mongoose";

interface ISubcategory {
	categoryName: string;
	categoryId: string;
	subcategoryName: string;
	subcategoryId: string;
	templates: string[];
	subcategoryDescription?: string;
}

export async function GET(req: NextRequest, res: NextResponse) {
	try {
		// Check if connection to the database is established
		await checkConnection();

		// Find all subcategories
		const subcategories = await Subcategory.find();

		return NextResponse.json(subcategories);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const body = await req.json();

		if (!body) {
			return NextResponse.json({ message: "Invalid body" }, { status: 400 });
		}

		// Check if connection to the database is established
		await checkConnection();

		const subcategoryData = body as ISubcategory[];

		for (const subcategory of subcategoryData) {
			// Create a new subcategory document
			const createdSubcategory = await Subcategory.create(subcategory);

			// Update the corresponding category document by adding the subcategory's ObjectId to the subcategories array
			await Category.findOneAndUpdate(
				{ categoryId: subcategory.categoryId },
				{ $push: { subcategories: createdSubcategory._id } },
				{ new: true }
			);
		}

		return NextResponse.json({ message: "Subcategories created:", data: subcategoryData }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}
