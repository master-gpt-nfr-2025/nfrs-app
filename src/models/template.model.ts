import mongoose, { Schema } from "mongoose";

const baseOptions = {
	discriminatorKey: "elementType",
};

const templateElementSchema = new Schema(
	{
		elementType: { type: String, required: true },
	},
	baseOptions
);

if (!mongoose.models.TemplateElement) {
	mongoose.model("TemplateElement", templateElementSchema);
}

const TemplateElement = mongoose.models.TemplateElement;

// Check if discriminators are already created
if (!TemplateElement.discriminators) {
	// Text Element Schema
	const textElementSchema = new Schema({
		value: { type: String, required: true },
	});

	// Input Element Schema
	const inputElementSchema = new Schema({
		inputType: { type: String, enum: ["text", "number"], required: true },
		placeholder: { type: String, required: true },
	});

	// Choice Element Schema
	const choiceElementSchema = new Schema({
		placeholder: { type: String, required: true },
		options: { type: [Schema.Types.Mixed], required: true },
	});

	// Choice Element Option Schema
	const choiceElementOptionSchema = new Schema({
		label: { type: String, required: true },
		value: { type: String, required: true },
		content: { type: [templateElementSchema], required: true },
	});

	// Optional Element Schema
	const optionalElementSchema = new Schema({
		placeholder: { type: String, required: true },
		content: { type: [templateElementSchema], required: true },
	});

	// Repeatable Element Schema
	const repeatableElementSchema = new Schema({
		placeholder: { type: String, required: true },
		required: { type: Boolean, required: true },
		maxInstances: { type: Number, required: true },
		content: { type: [templateElementSchema], required: true },
	});

	// Reference Element Schema
	const referenceElementSchema = new Schema({
		refId: { type: String, required: true },
	});

	// Create Discriminators
	TemplateElement.discriminator("text", textElementSchema);
	TemplateElement.discriminator("input", inputElementSchema);
	TemplateElement.discriminator("choice", choiceElementSchema);
	TemplateElement.discriminator("group", choiceElementOptionSchema);
	TemplateElement.discriminator("optional", optionalElementSchema);
	TemplateElement.discriminator("repeatable", repeatableElementSchema);
	TemplateElement.discriminator("reference", referenceElementSchema);
}

const templateSchema = new Schema({
	id: { type: String, required: true },
	categoryId: { type: String, required: true },
	subcategoryId: { type: String, required: true },
	name: { type: String, required: true },
	content: { type: [templateElementSchema], required: true },
});

export default mongoose.models.Template || mongoose.model("Template", templateSchema, "templates");
