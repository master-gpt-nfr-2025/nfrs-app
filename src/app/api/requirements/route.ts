import { checkConnection } from "@/config/db";
import RequirementModel from "@/models/requirement.model";
import Subcategory from "@/models/subcategory.model";
import { NextRequest, NextResponse } from "next/server";
import { ISubcategory } from "../subcategories/clear/route";

export async function DELETE() {
	try {
		await checkConnection();
		const requirements = await RequirementModel.find();

		for (const requirement of requirements) {
			await RequirementModel.findByIdAndDelete(requirement._id);
		}

		const subcategories = await Subcategory.find();
		const subcategoryData = subcategories as ISubcategory[];

		for (const subcategory of subcategoryData) {
			await Subcategory.updateOne({ subcategoryId: subcategory.subcategoryId }, { requirements: [] });
		}

		return NextResponse.json({ message: "Deleted all requirements and cleared subcategories:", data: subcategoryData }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}
