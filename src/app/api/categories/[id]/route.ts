import { checkConnection } from "@/config/db";
import { NextResponse } from "next/server";
import Category from "@/models/category.model";
import Subcategory from "@/models/subcategory.model";
import Template from "@/models/template.model";

interface IParams {
	params: {
		id: string;
	};
}

export async function GET(req: Request, { params }: IParams) {
	try {
		await checkConnection();
		const category = await Category.findOne({ categoryId: params.id });

		if (!category) {
			return NextResponse.json({ message: "Category not found" }, { status: 404 });
		}
		return NextResponse.json(category);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}
