"use client";
import { Box, Card, Stack, Typography } from "@mui/joy";
import React from "react";
import { CategoryType } from "@/app/requirements/create/page";
import SubcategoryTile from "./subcategory-tile";

type SelectCategoryProps = {
	categories: CategoryType[];
};

const SelectCategory = ({ categories }: SelectCategoryProps) => {
	return (
		<Box sx={{ display: "flex", flexWrap: "wrap", flexGrow: 1, gap: "1rem" }}>
			{categories.map((category) => (
				<Card key={category._id} variant="soft">
					<Typography fontSize="sm" fontWeight="lg">
						{category.categoryName}
					</Typography>
					<Stack spacing={1} direction={"row"}>
						{category.subcategories.map((subcategory) => (
							<SubcategoryTile key={subcategory._id} subcategory={subcategory} />
						))}
					</Stack>
				</Card>
			))}
		</Box>
	);
};

export default SelectCategory;
