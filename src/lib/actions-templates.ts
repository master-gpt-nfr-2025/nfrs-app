"use server";
import connect from "@/config/db";
import TemplateModel from "@/models/template.model";

const fetchTemplateDetails = async (templateId: string) => {
	await connect();
	const result = await TemplateModel.findById(templateId).lean();
	return JSON.parse(JSON.stringify(result));
};

const fetchTemplatesForSubcategory = async (subcategoryId: string) => {
	await connect();
	const result = await TemplateModel.find({ subcategoryId: subcategoryId }).select("id name").lean();
	return JSON.parse(JSON.stringify(result));
};

export { fetchTemplateDetails, fetchTemplatesForSubcategory };
