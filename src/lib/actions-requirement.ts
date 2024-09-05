"use server";
import RequirementModel, { RequirementElementModel } from "@/models/requirement.model";
import SubcategoryModel from "@/models/subcategory.model";
import UserModel from "@/models/user.model";
import { Requirement } from "@/types/requirement";
import mongoose from "mongoose";

const saveRequirement = async (requirement: Requirement, userID?: string): Promise<string | null> => {
	const existingRequirementName = await RequirementModel.findOne({ name: requirement.name, createdBy: userID });
	if (existingRequirementName) {
		return null;
	}
	const existingRequirementId = await RequirementModel.findById(requirement._id);
	if (existingRequirementId) {
		return null;
	}

	const newID = new mongoose.Types.ObjectId();

	// Create a new requirement with properly discriminated content
	const newRequirement = new RequirementModel({
		...requirement,
		_id: newID,
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

	if (requirement.createdBy) {
		UserModel.findByIdAndUpdate(requirement.createdBy, { $push: { requirements: newID } });
	}

	const subcategory = await SubcategoryModel.findOne({ subcategoryId: requirement.subcategoryId });

	if (!subcategory) {
		throw new Error("Subcategory not found!");
	}

	subcategory.requirements.push(newRequirement._id);
	await subcategory.save();

	return newRequirement._id.toString();
};

const updateRequirement = async (requirement: Requirement, userID?: string) => {
	const existingRequirement = await RequirementModel.findById(requirement._id);
	if (!existingRequirement) {
		return false;
	}
	const existingRequirementName = await RequirementModel.findOne({ name: requirement.name, createdBy: userID });
	if (existingRequirementName && existingRequirementName._id.toString() !== requirement._id) {
		return false;
	}

	existingRequirement.name = requirement.name;

	existingRequirement.content = requirement.content.map((element) => {
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
	});

	await existingRequirement.save();
	return true;
};

const moveToTrash = async (requirementId: string, userId: string | undefined) => {
	try {
		const filter = { id: requirementId };
		const update = { trashed: true, trashedAt: new Date(), trashedBy: userId };
		const updated = await RequirementModel.findOneAndUpdate(filter, update, { new: true });

		if (!updated) {
			console.error(`Requirement not found: ${requirementId}`);
			throw new Error("Requirement not found");
		}
	} catch (error) {
		console.error("Error in moveToTrash:", error);
		throw new Error("Error while moving requirement to trash");
	}
};

const restoreFromTrash = async (requirementId: string) => {
	try {
		const filter = { _id: requirementId };
		const update = { trashed: false, trashedAt: null, trashedBy: null };
		const updated = await RequirementModel.findOneAndUpdate(filter, update, { new: true });

		if (!updated) {
			console.error(`Requirement not found: ${requirementId}`);
			throw new Error("Requirement not found");
		}
	} catch (error) {
		console.error("Error in restoreFromTrash:", error);
		throw new Error("Error while restoring requirement from trash");
	}
};

const removeRequirement = async (requirementId: string) => {
	try {
		const filter = { _id: requirementId };
		await RequirementModel.findOneAndDelete(filter);
	} catch (error) {
		console.error("Error in removeRequirement:", error);
		throw new Error("Error while removing requirement");
	}
};

const getMatchingRequirements = async (query: string, userId?: string) => {
	const matchingRequirements = await RequirementModel.find({ name: { $regex: query, $options: "i" }, trashed: false, createdBy: userId })
		.limit(10)
		.lean();
	return JSON.parse(
		JSON.stringify(
			matchingRequirements.map((requirement) => ({
				id: requirement.id,
				name: requirement.name.length > 30 ? `${requirement.name.slice(0, 30)}...` : requirement.name,
				_id: requirement._id,
			}))
		)
	);
};

export { saveRequirement, updateRequirement, moveToTrash, restoreFromTrash, removeRequirement, getMatchingRequirements };
