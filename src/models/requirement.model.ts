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
		refType: { type: String, required: true },
		refId: { type: String, required: true },
	});

	// Create Discriminators
	requirementElement.discriminator("text", textElementSchemaReq);
	requirementElement.discriminator("input", inputElementSchema);
	requirementElement.discriminator("choice", choiceElementSchema);
	requirementElement.discriminator("group", choiceElementOptionSchema);
	requirementElement.discriminator("optional", optionalElementSchema);
	requirementElement.discriminator("repeatable", repeatableElementSchema);
	requirementElement.discriminator("reference", referenceElementSchema);
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
