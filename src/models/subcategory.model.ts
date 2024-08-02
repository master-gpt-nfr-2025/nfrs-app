import mongoose, { Schema } from "mongoose";

const subcategorySchema = new Schema({
	categoryName: { type: String, required: true },
	categoryId: { type: String, required: true },
	subcategoryName: { type: String, required: true },
	subcategoryId: { type: String, required: true },
	description: { type: String, required: true },
	icon: { type: String, required: true },
	templates: [{ type: Schema.Types.ObjectId, ref: "Template" }],
	requirements: [{ type: Schema.Types.ObjectId, ref: "Requirement" }],
});

export default mongoose.models.Subcategory || mongoose.model("Subcategory", subcategorySchema, "subcategories");
