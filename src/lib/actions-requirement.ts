"use server";
import { RequirementModel, RequirementElementModel } from "@/models/requirement.model";
import SubcategoryModel from "@/models/subcategory.model";
import { Requirement } from "@/types/requirement";

const saveRequirement = async (requirement: Requirement) => {
	const existingRequirement = await RequirementModel.findOne({ name: requirement.name });
	if (existingRequirement) {
		return false;
	}

	// Create a new requirement with properly discriminated content
	const newRequirement = new RequirementModel({
		...requirement,
		content: requirement.content.map((element) => {
			let ElementModel;

			switch (element.elementType) {
				case "textReq":
					ElementModel = RequirementElementModel.discriminators?.textReq;
					break;
				case "inputReq":
					ElementModel = RequirementElementModel.discriminators?.inputReq;
					break;
				case "choiceReq":
					ElementModel = RequirementElementModel.discriminators?.choiceReq;
					break;
				case "groupReq":
					ElementModel = RequirementElementModel.discriminators?.groupReq;
					break;
				case "optionalReq":
					ElementModel = RequirementElementModel.discriminators?.optionalReq;
					break;
				case "repeatableReq":
					ElementModel = RequirementElementModel.discriminators?.repeatableReq;
					break;
				case "referenceReq":
					ElementModel = RequirementElementModel.discriminators?.referenceReq;
					break;
				default:
					throw new Error(`Unknown element type`);
			}

			if (!ElementModel) {
				throw new Error(`Discriminator not found for element type: ${element.elementType}`);
			}

			return new ElementModel(element);
		}),
	});

	await newRequirement.save();

	const subcategory = await SubcategoryModel.findOne({ subcategoryId: requirement.subcategoryId });

	if (!subcategory) {
		throw new Error("Subcategory not found!");
	}

	subcategory.requirements.push(newRequirement._id);
	await subcategory.save();

	return true;
};

export { saveRequirement };
