"use client";
import React from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import Link from "next/link";
import Category from "@/models/category.model";
import { Box, Input, IconButton, Typography } from "@mui/joy";
import { CategoryItem } from "./category-item";
import { StyledTreeItem } from "./styled-tree-item";
import { Icon } from "@iconify/react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

function ExpandIcon(props: SvgIconProps) {
	return (
		<SvgIcon className="expand" fontSize="inherit" style={{ width: 16, height: 16 }} viewBox="0 0 256 256" {...props}>
			<path d="m184.49 136.49l-80 80a12 12 0 0 1-17-17L159 128L87.51 56.49a12 12 0 1 1 17-17l80 80a12 12 0 0 1-.02 17"></path>
		</SvgIcon>
	);
}

function CollapseIcon(props: SvgIconProps) {
	return (
		<SvgIcon className="collapse" fontSize="inherit" style={{ width: 16, height: 16 }} viewBox="0 0 256 256" {...props}>
			<path d="m216.49 104.49l-80 80a12 12 0 0 1-17 0l-80-80a12 12 0 0 1 17-17L128 159l71.51-71.52a12 12 0 0 1 17 17Z"></path>
		</SvgIcon>
	);
}

function EmptyIcon(props: SvgIconProps) {
	return (
		<SvgIcon className="empty" fontSize="inherit" style={{ width: 16, height: 16 }} viewBox="0 0 256 256" {...props}>
			<path d="M92.38 38.05A12 12 0 0 1 101 23.42a108 108 0 0 1 54 0a12 12 0 1 1-6 23.23a84.1 84.1 0 0 0-42 0a12 12 0 0 1-14.62-8.6M50.94 52.34a108.1 108.1 0 0 0-27 46.76a12 12 0 0 0 8.37 14.77a12.2 12.2 0 0 0 3.2.43a12 12 0 0 0 11.56-8.8a84 84 0 0 1 21-36.35a12 12 0 1 0-17.13-16.81m-3.88 98.14a12 12 0 0 0-23.12 6.42a108 108 0 0 0 27 46.78A12 12 0 0 0 68 186.85a84 84 0 0 1-20.94-36.37M149 209.35a84 84 0 0 1-42 0a12 12 0 1 0-6 23.23a108 108 0 0 0 54 0a12 12 0 1 0-6-23.23m74.72-67.22A12 12 0 0 0 209 150.5a84 84 0 0 1-21 36.35a12 12 0 0 0 17.12 16.82a108.2 108.2 0 0 0 27-46.77a12 12 0 0 0-8.41-14.77Zm-14.77-36.61a12 12 0 0 0 23.12-6.42a108 108 0 0 0-27-46.78A12 12 0 1 0 188 69.15a84 84 0 0 1 20.94 36.37Z"></path>
		</SvgIcon>
	);
}

interface Category {
	categoryName: string;
	categoryId: string;
	subcategories: Subcategory[];
}

interface Subcategory {
	subcategoryName: string;
	subcategoryId: string;
	requirements: Requirement[];
}

interface Requirement {
	_id: string;
	id: string;
	name: string;
}

function RequirementTree({ categories }: { categories: Category[] }) {
	return (
		<Box sx={{ height: "calc(100vh - 88px - 11.5rem)", display: "flex", flexDirection: "column" }}>
			<Input
				placeholder="Search..."
				variant="soft"
				sx={{ marginBottom: 2 }}
				endDecorator={
					<IconButton color="primary" variant="soft" size="md" sx={{ mr: -1.5, borderRadius: "6px" }}>
						<Icon icon="ph:magnifying-glass-bold" />
					</IconButton>
				}
			/>

			<Box sx={{ flex: 1, overflowY: "auto" }}>
				<SimpleTreeView
					slots={{
						expandIcon: ExpandIcon,
						collapseIcon: CollapseIcon,
					}}
				>
					{categories.map((category) => (
						<CategoryItem key={category.categoryId} itemId={category.categoryId} name={category.categoryName}>
							{category.subcategories.map((subcategory) => (
								<CategoryItem key={subcategory.subcategoryId} itemId={subcategory.subcategoryId} name={subcategory.subcategoryName}>
									{subcategory.requirements.length > 0
										? subcategory.requirements.map((requirement) => {
												return (
													<StyledTreeItem
														key={requirement._id}
														itemId={requirement._id}
														className="tree-item"
														label={
															<Link href={`/requirement/${requirement._id}`}>
																<Typography sx={{ textDecoration: "none", color: "text.primary" }}>
																	{requirement.name}
																</Typography>
															</Link>
														}
													/>
												);
										  })
										: null}
								</CategoryItem>
							))}
						</CategoryItem>
					))}
				</SimpleTreeView>
			</Box>
		</Box>
	);
}

export default RequirementTree;
