import { NextRequest, NextResponse } from "next/server";
import { checkConnection } from "@/config/db";
import Subcategory from "@/models/subcategory.model";

interface ISubcategory {
	categoryName: string;
	categoryId: string;
	subcategoryName: string;
	subcategoryId: string;
	templates: string[];
	subcategoryDescription?: string;
}

export async function PUT(req: NextRequest, res: NextResponse) {
	try {
		// Check if connection to the database is established
		await checkConnection();

		const subcategories = await Subcategory.find();
		const subcategoryData = subcategories as ISubcategory[];

		for (const subcategory of subcategoryData) {
			await Subcategory.updateOne({ subcategoryId: subcategory.subcategoryId }, { templates: [] });
		}

		return NextResponse.json({ message: "Subcategories cleared:", data: subcategoryData }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}
