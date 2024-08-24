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
		const searchParams = req.nextUrl.searchParams;
		const populate: boolean = searchParams.get("populate") === "true" ? true : false;

		if (populate) {
			// Find all categories and populate subcategories and templates
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
		} else {
			// Find all categories
			const categories = await Category.find();
			return NextResponse.json(categories);
		}
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

		const categories = body as ICategory[];

		for (const category of categories) {
			await Category.create(category);
		}

		return NextResponse.json({ message: "Categories created:", data: categories }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}

export async function PUT(req: NextRequest, res: NextResponse) {
	try {
		const body = await req.json();

		if (!body) {
			return NextResponse.json({ message: "Invalid body" }, { status: 400 });
		}

		// Check if connection to the database is established
		await checkConnection();

		const categoryData = body as ICategory[];

		for (const category of categoryData) {
			await Category.updateOne({ categoryId: category.categoryId }, category);
		}

		return NextResponse.json({ message: "Categories updated:", data: categoryData }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}
