import { checkConnection } from "@/config/db";
import { NextResponse } from "next/server";
import Template from "@/models/template.model";

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
