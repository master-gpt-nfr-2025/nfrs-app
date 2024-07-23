import { Box, Card, Stack, Typography } from "@mui/joy";
import React from "react";
import Category from "@/models/category.model";
import Subcategory from "@/models/subcategory.model";
import User from "@/models/user.model";
import RequirementModel from "@/models/requirement.model";
import RequirementTree from "@/components/ui/requirement-tree";
import connect from "@/config/db";
import { cookies } from "next/headers";

export default async function RequirementsLayout({ children }: { children: React.ReactNode }) {
	const fetchCategories = async (userId?: string) => {
		"use server";
		await connect();
		await Subcategory.findOne();
		await RequirementModel.findOne();
		const currentUser = await User.findById(userId);
		if (currentUser.role === "admin") {
			const categories = await Category.find().populate({
				path: "subcategories",
				select: "subcategoryName subcategoryId requirements",
				populate: {
					path: "requirements",
					select: "name id _id",
					model: "Requirement",
					match: { isTrashed: false },
				},
			});
			return categories;
		}
		if (userId) {
			const categories = await Category.find().populate({
				path: "subcategories",
				select: "subcategoryName subcategoryId requirements",
				populate: {
					path: "requirements",
					select: "name id _id",
					model: "Requirement",
					match: { createdBy: userId, trashed: false },
				},
			});
			return categories;
		} else {
			const categories = await Category.find().populate({
				path: "subcategories",
				select: "subcategoryName subcategoryId requirements",
				populate: {
					path: "requirements",
					select: "name id _id",
					model: "Requirement",
					match: { createdBy: "null", isTrashed: false },
				},
			});
			return categories;
		}
	};

	const cookieStore = cookies();
	const userId = cookieStore.get("userId")?.value;

	const categories = await fetchCategories(userId);
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<Typography level="h3">Lista wymagań</Typography>
			<Typography level="body-md">Przeglądaj wszystkie utworzone wymagania. Możesz je tutaj również duplikować i edytować</Typography>
			<Stack gap={1} alignItems="flex-start" direction="row">
				<Card variant="plain" sx={{ flex: 1 }}>
					<RequirementTree categories={JSON.parse(JSON.stringify(categories))} />
				</Card>
				{children}
			</Stack>
		</Box>
	);
}
