import { NextRequest, NextResponse } from "next/server";
import { checkConnection } from "@/config/db";
import Category from "@/models/category.model";

export interface ICategory {
	categoryName: string;
	categoryId: string;
	subcategories: string[];
}

export async function PUT(req: NextRequest, res: NextResponse) {
	try {
		// Check if connection to the database is established
		await checkConnection();

		const categories = await Category.find();
		const categoryData = categories as ICategory[];

		for (const category of categoryData) {
			await Category.updateOne({ categoryId: category.categoryId }, { subcategories: [] });
		}

		return NextResponse.json({ message: "Categories cleared:", data: categoryData }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}
