import mongoose, { Model, Schema } from "mongoose";

const baseOptions = {
	discriminatorKey: "elementType",
};

const requirementElementSchema = new Schema(
	{
		elementType: { type: String, required: true },
		id: { type: String, required: true },
	},
	baseOptions
);

let RequirementElementModel: Model<any>;

if (!mongoose.models.requirementElement) {
	RequirementElementModel = mongoose.model("requirementElement", requirementElementSchema);
} else {
	RequirementElementModel = mongoose.models.requirementElement;
}

const requirementElement = mongoose.models.requirementElement;

// Check if discriminators are already created
if (!RequirementElementModel.discriminators || Object.keys(RequirementElementModel.discriminators).length === 0) {
	// Text Element Schema
	const textElementSchemaReq = new Schema({
		value: { type: String, required: true },
	});

	// Input Element Schema
	const inputElementSchema = new Schema({
		inputType: { type: String, enum: ["text", "number"], required: true },
		placeholder: { type: String, required: true },
		value: { type: Schema.Types.Mixed, required: true },
	});

	// Choice Element Schema
	const choiceElementSchema = new Schema({
		placeholder: { type: String, required: true },
		options: { type: [Schema.Types.Mixed], required: true },
		selectedOption: { type: String, required: true },
	});

	// Choice Element Option Schema
	const choiceElementOptionSchema = new Schema({
		label: { type: String, required: true },
		value: { type: String, required: true },
		content: { type: [requirementElementSchema], required: true },
	});

	// Optional Element Schema
	const optionalElementSchema = new Schema({
		placeholder: { type: String, required: true },
		enabled: { type: Boolean, required: true },
		content: { type: [requirementElementSchema], required: true },
	});

	// Repeatable Element Schema
	const repeatableElementSchema = new Schema({
		placeholder: { type: String, required: true },
		required: { type: Boolean, required: true },
		maxInstances: { type: Number, required: true },
		content: { type: [requirementElementSchema], required: true },
		instances: { type: [[requirementElementSchema]], required: true },
	});

	// Reference Element Schema
	const referenceElementSchema = new Schema({
		placeholder: { type: String, required: true },
		refElements: [{ type: Schema.Types.ObjectId, ref: "Requirement" }],
	});

	// Create Discriminators
	RequirementElementModel.discriminator("textReq", textElementSchemaReq);
	RequirementElementModel.discriminator("inputReq", inputElementSchema);
	RequirementElementModel.discriminator("choiceReq", choiceElementSchema);
	RequirementElementModel.discriminator("groupReq", choiceElementOptionSchema);
	RequirementElementModel.discriminator("optionalReq", optionalElementSchema);
	RequirementElementModel.discriminator("repeatableReq", repeatableElementSchema);
	RequirementElementModel.discriminator("referenceReq", referenceElementSchema);
}

const requirementSchema = new Schema({
	custom: { type: Boolean, required: true, default: false },
	id: { type: String, required: true },
	trashed: { type: Boolean, default: false, required: true },
	trashedAt: { type: Date },
	trashedBy: { type: Schema.Types.Mixed, ref: "User" },
	createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
	createdAt: { type: Date, required: true },
	createdThrough: { type: String, enum: ["creator", "catalogue"], required: true },
	categoryId: { type: String, required: true },
	subcategoryId: { type: String, required: true },
	name: { type: String, required: true },
	templateId: { type: String, required: true },
	content: { type: [requirementElementSchema], required: true },
});

const RequirementModel = mongoose.models.Requirement || mongoose.model("Requirement", requirementSchema, "requirements");

export default RequirementModel;
export { RequirementElementModel };
