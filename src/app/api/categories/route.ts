import { NextRequest, NextResponse } from "next/server";
import { checkConnection } from "@/config/db";
import Category from "@/models/category.model";

interface ICategory {
	categoryName: string;
	categoryId: string;
	subcategories: string[];
}

export async function GET(req: NextRequest, res: NextResponse) {
	try {
		// Check if connection to the database is established
		await checkConnection();

		// Find all categories
		const categories = await Category.find().populate({
			path: "subcategories",
			select: "subcategoryName subcategoryId templates",
			populate: {
				path: "templates",
				select: "name id",
				model: "Template",
			},
		});

		return NextResponse.json(categories);
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

		const categoryData = body as ICategory[];

		for (const category of categoryData) {
			await Category.create(category);
		}

		return NextResponse.json({ message: "Categories created:", data: categoryData }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}
