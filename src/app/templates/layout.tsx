import { Box, Card, Stack, Typography } from "@mui/joy";
import React from "react";
import Category from "@/models/category.model";
import Subcategory from "@/models/subcategory.model";
import Template from "@/models/template.model";
import TemplateTree from "@/components/ui/template-tree";
import connect from "@/config/db";

export default async function TemplatesLayout({ children }: { children: React.ReactNode }) {
	const fetchCategories = async () => {
		"use server";
		await connect();
		await Subcategory.findOne();
		await Template.findOne();
		const categories = await Category.find().populate({
			path: "subcategories",
			select: "subcategoryName subcategoryId templates",
			populate: {
				path: "templates",
				select: "name id",
				model: "Template",
			},
		});
		return categories;
	};

	const categories = await fetchCategories();

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", zIndex: 0 }}>
			<Typography level="h3">Katalog szablonów</Typography>
			<Typography level="body-md">
				Przeglądaj wszystkie dostępne szablony. Możesz również tworzyć wymagania bezpośrednio z wybranego szablonu
			</Typography>
			<Stack gap={2} justifyContent="flex-start" direction={"row"} alignItems={"flex-start"}>
				<Card variant="plain" sx={{ flex: 2 }}>
					<TemplateTree categories={JSON.parse(JSON.stringify(categories))} />
				</Card>
				{children}
			</Stack>
		</Box>
	);
}
