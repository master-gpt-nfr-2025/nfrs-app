"use server";
import RequirementModel from "@/models/requirement.model";
import SubcategoryModel from "@/models/subcategory.model";
import { Requirement } from "@/types/requirement";

const saveRequirement = async (requirement: Requirement) => {
	const existingRequirement = await RequirementModel.findOne({ name: requirement.name });
	if (existingRequirement) {
		return false;
	}

	const newRequirement = await RequirementModel.create(requirement);

	const subcategory = await SubcategoryModel.findOne({ subcategoryId: requirement.subcategoryId });

	if (!subcategory) {
		throw new Error("Subcategory not found!");
	}

	subcategory.requirements.push(newRequirement._id);
	await subcategory.save();

	return true;
};

export { saveRequirement };
