"use client";
import { Box, Card, CircularProgress, Stack, Typography } from "@mui/joy";
import React from "react";
import { CategoryType } from "@/app/requirements/create/page";
import SubcategoryTile from "./subcategory-tile";
import DialogNavigationButtons from "../ui/dialog-navigation-buttons";

type SelectCategoryProps = {
	categories: CategoryType[];
	selectedSubcategory: string | null;
	onSubcategorySelect: (subcategoryId: string | null) => void;
	loading: boolean;
};

const SelectCategory = ({ categories, onSubcategorySelect, selectedSubcategory, loading }: SelectCategoryProps) => {
	const handleSubcategoryClick = (subcategoryId: string) => {
		const newSelectedSubcategory = selectedSubcategory === subcategoryId ? null : subcategoryId;
		onSubcategorySelect(newSelectedSubcategory);
	};

	return (
		<>
			<Box sx={{ display: "flex", flexWrap: "wrap", flexGrow: 1, gap: "1rem" }}>
				{loading ? (
					<Stack alignItems="center" justifyContent="center" flexGrow={1}>
						<CircularProgress />
						<Typography>Ładowanie kategorii...</Typography>
					</Stack>
				) : (
					categories.map((category) => (
						<Card key={category._id} variant="soft">
							<Typography fontSize="sm" fontWeight="lg">
								{category.categoryName}
							</Typography>
							<Stack spacing={1} direction={"row"}>
								{category.subcategories.map((subcategory) => (
									<SubcategoryTile
										key={subcategory.subcategoryId}
										subcategory={subcategory}
										selected={selectedSubcategory === subcategory.subcategoryId}
										onClick={handleSubcategoryClick}
									/>
								))}
							</Stack>
						</Card>
					))
				)}
			</Box>
			<DialogNavigationButtons nextActive={!!selectedSubcategory} />
		</>
	);
};

export default SelectCategory;
