import mongoose, { Schema } from "mongoose";

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

if (!mongoose.models.requirementElement) {
	mongoose.model("requirementElement", requirementElementSchema);
}

const requirementElement = mongoose.models.requirementElement;

// Check if discriminators are already created
if (!requirementElement.discriminators) {
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
		refId: { type: Schema.Types.ObjectId, ref: "Requirement", required: true },
	});

	// Create Discriminators
	requirementElement.discriminator("textReq", textElementSchemaReq);
	requirementElement.discriminator("inputReq", inputElementSchema);
	requirementElement.discriminator("choiceReq", choiceElementSchema);
	requirementElement.discriminator("groupReq", choiceElementOptionSchema);
	requirementElement.discriminator("optionalReq", optionalElementSchema);
	requirementElement.discriminator("repeatableReq", repeatableElementSchema);
	requirementElement.discriminator("referenceReq", referenceElementSchema);
}

const requirementSchema = new Schema({
	id: { type: String, required: true },
	categoryId: { type: String, required: true },
	subcategoryId: { type: String, required: true },
	name: { type: String, required: true },
	templateId: { type: String, required: true },
	content: { type: [requirementElementSchema], required: true },
});

export default mongoose.models.Requirement || mongoose.model("Requirement", requirementSchema, "requirements");
