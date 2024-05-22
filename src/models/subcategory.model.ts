import mongoose, { Schema } from "mongoose";

const subcategorySchema = new Schema({
	categoryName: { type: String, required: true },
	categoryId: { type: String, required: true },
	subcategoryName: { type: String, required: true },
	subcategoryId: { type: String, required: true },
	subcategoryDescription: { type: String, required: false },
	templates: [{ type: Schema.Types.ObjectId, ref: "Template" }],
});

export default mongoose.models.Subcategory || mongoose.model("Subcategory", subcategorySchema, "subcategories");
