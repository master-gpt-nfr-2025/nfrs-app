import { checkConnection } from "@/config/db";
import TemplateModel from "@/models/template.model";
import { Template as TemplateType } from "@/types/template";
import Subcategory from "@/models/subcategory.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		await checkConnection();
		const templates = await TemplateModel.find();
		return NextResponse.json(templates);
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

		const templatesData = body as TemplateType[];
		for (const template of templatesData) {
			// Validate content elements based on their type before creating the template
			for (const element of template.content) {
				if (!["text", "input", "choice", "group", "optional", "repeatable", "reference"].includes(element.elementType)) {
					return NextResponse.json({ message: "Invalid element type", element }, { status: 400 });
				}
			}
		}
		const createdTemplates = await TemplateModel.create(templatesData);

		for (const template of createdTemplates) {
			await Subcategory.findOneAndUpdate({ subcategoryId: template.subcategoryId }, { $push: { templates: template._id } }, { new: true });
		}

		return NextResponse.json({ message: "Templates created:", templatesData: templatesData }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest, res: NextResponse) {
	try {
		const body = await req.json();

		if (!body) {
			return NextResponse.json({ message: "Invalid body" }, { status: 400 });
		}

		// Check if connection to the database is established
		await checkConnection();

		const templatesData = body as TemplateType[];
		for (const template of templatesData) {
			// Validate content elements based on their type before creating the template
			for (const element of template.content) {
				if (!["text", "input", "choice", "group", "optional", "repeatable", "reference"].includes(element.elementType)) {
					return NextResponse.json({ message: "Invalid element type", element }, { status: 400 });
				}
			}

			await TemplateModel.findOneAndUpdate({ name: "Brak szablonu" }, template, { new: true });
		}

		return NextResponse.json({ message: "Templates updated", templatesData }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}

// delete all templates
export async function DELETE() {
	try {
		await checkConnection();
		await TemplateModel.deleteMany();
		return NextResponse.json({ message: "All templates deleted" });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}
