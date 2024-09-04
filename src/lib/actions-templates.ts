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
	const result = await TemplateModel.find({ subcategoryId: subcategoryId }).select("_id id name description custom").lean();
	return JSON.parse(JSON.stringify(result));
};

const fetchCustomTemplateForSubcategory = async (subcategoryId: string) => {
	await connect();
	const result = await TemplateModel.findOne({ subcategoryId: subcategoryId, custom: true }).select("_id id name description custom").lean();
	return JSON.parse(JSON.stringify(result));
};

export { fetchTemplateDetails, fetchTemplatesForSubcategory, fetchCustomTemplateForSubcategory };
