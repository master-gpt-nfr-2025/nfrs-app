import { Box, Card, Typography } from "@mui/joy";
import React from "react";
import Category from "@/models/category.model";
import Subcategory from "@/models/subcategory.model";
import Template from "@/models/template.model";
import Requirement from "@/models/requirement.model";
import RequirementTree from "@/components/ui/requirement-tree";
import connect from "@/config/db";

export default async function TemplatesLayout({ children }: { children: React.ReactNode }) {
	const fetchCategories = async () => {
		"use server";
		await connect();
		await Subcategory.findOne();
		await Requirement.findOne();
		const categories = await Category.find().populate({
			path: "subcategories",
			select: "subcategoryName subcategoryId requirements",
			populate: {
				path: "requirements",
				select: "name id _id",
				model: "Requirement",
			},
		});
		return categories;
	};

	const categories = await fetchCategories();

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<Typography level="h3">Lista wymagań</Typography>
			<Typography level="body-md">Przeglądaj wszystkie utworzone wymagania. Możesz je tutaj również duplikować i edytować</Typography>
			<Box sx={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
				<Card variant="plain" sx={{ flex: 2 }}>
					<RequirementTree categories={JSON.parse(JSON.stringify(categories))} />
				</Card>
				<Card variant="plain" sx={{ flex: 3, minHeight: "40vh" }}>
					{children}
				</Card>
			</Box>
		</Box>
	);
}
