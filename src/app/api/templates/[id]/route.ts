import { checkConnection } from "@/config/db";
import { NextResponse } from "next/server";
import Template from "@/models/template.model";
import Subcategory from "@/models/subcategory.model";

interface IParams {
	params: {
		id: string;
	};
}

export async function GET(req: Request, { params }: IParams) {
	try {
		await checkConnection();
		const template = await Template.findOne({ id: params.id });

		if (!template) {
			return NextResponse.json({ message: "Template not found" }, { status: 404 });
		}
		return NextResponse.json(template);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: IParams) {
	try {
		await checkConnection();
		const template = await Template.findOne({ id: params.id });

		if (!template) {
			return NextResponse.json({ message: "Template not found" }, { status: 404 });
		}
		await Template.findByIdAndDelete(template._id);
		const subcategory = await Subcategory.findOne({ subcategoryId: template.subcategoryId });
		subcategory.templates = subcategory.templates.filter((id: string) => id !== template.id);
		await subcategory.save();
		return NextResponse.json({ message: "Template deleted" });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}

export async function PUT(req: Request, { params }: IParams) {
	try {
		const body = await req.json();

		if (!body) {
			return NextResponse.json({ message: "Invalid body" }, { status: 400 });
		}

		await checkConnection();
		const template = await Template.findOne({ id: params.id });

		if (!template) {
			return NextResponse.json({ message: "Template not found" }, { status: 404 });
		}

		const updatedTemplate = await Template.findByIdAndUpdate(template._id, body, { new: true });
		return NextResponse.json(updatedTemplate);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}
