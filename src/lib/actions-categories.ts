"use server";
import connect from "@/config/db";
import CategoryModel from "@/models/category.model";
import SubcategoryModel from "@/models/subcategory.model";

const fetchCategories = async () => {
	await connect();
	await SubcategoryModel.findOne();
	const result = await CategoryModel.find()
		.populate({
			path: "subcategories",
			select: "subcategoryName subcategoryId subcategoryDescription",
		})
		.lean();

	return JSON.parse(JSON.stringify(result));
};

export { fetchCategories };
