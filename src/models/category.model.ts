import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
	categoryName: { type: String, required: true },
	categoryId: { type: String, required: true },
	subcategories: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }],
});

export default mongoose.models.Category || mongoose.model("Category", categorySchema, "categories");
