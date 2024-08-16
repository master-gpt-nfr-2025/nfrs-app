"use client";
import React, { useMemo, useState } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import Link from "next/link";
import Category from "@/models/category.model";
import { Box, Input, IconButton, Typography, Tooltip, Checkbox, Button, Stack, Dropdown, Menu, MenuItem, MenuButton, Badge, Divider } from "@mui/joy";
import { CategoryItem } from "./category-item";
import { StyledTreeItem } from "./styled-tree-item";
import { Icon } from "@iconify/react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { Popover } from "@mui/material";

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
	templates: Template[];
}

interface Template {
	id: string;
	name: string;
}

interface FilterOptions {
	templates: boolean;
	categories: boolean;
	subcategories: boolean;
}

function TemplateTree({ categories }: { categories: Category[] }) {
	const [filter, setFilter] = useState("");
	const [expandedItems, setExpandedItems] = useState<string[]>([]);
	const [filterOptions, setFilterOptions] = useState<FilterOptions>({
		templates: true,
		categories: true,
		subcategories: true,
	});
	const [matchCount, setMatchCount] = useState(0);

	const handleFilterOptionChange = (option: keyof FilterOptions) => {
		setFilterOptions((prev) => ({ ...prev, [option]: !prev[option] }));
	};

	const filteredCategories = useMemo(() => {
		const newExpandedItems: string[] = [];
		let totalMatches = 0;

		const filtered = categories.map((category) => {
			const categoryMatches = filterOptions.categories && category.categoryName.toLowerCase().includes(filter.toLowerCase());
			if (categoryMatches) totalMatches++;

			const filteredSubcategories = category.subcategories.map((subcategory) => {
				const subcategoryMatches = filterOptions.subcategories && subcategory.subcategoryName.toLowerCase().includes(filter.toLowerCase());
				if (subcategoryMatches) totalMatches++;

				const filteredTemplates = subcategory.templates.map((template) => {
					const templateMatches = filterOptions.templates && template.name.toLowerCase().includes(filter.toLowerCase());
					if (templateMatches) totalMatches++;
					return { ...template, matches: templateMatches };
				});

				if (categoryMatches || subcategoryMatches || filteredTemplates.some((t) => t.matches)) {
					newExpandedItems.push(category.categoryId, subcategory.subcategoryId);
				}

				return {
					...subcategory,
					matches: subcategoryMatches,
					templates: filteredTemplates,
				};
			});

			return {
				...category,
				matches: categoryMatches,
				subcategories: filteredSubcategories,
			};
		});

		setExpandedItems(newExpandedItems);
		setMatchCount(totalMatches);
		return filtered;
	}, [categories, filter, filterOptions]);

	const handleItemExpansionToggle = (event: React.SyntheticEvent, nodeId: string) => {
		setExpandedItems((oldExpanded) => (oldExpanded.includes(nodeId) ? oldExpanded.filter((id) => id !== nodeId) : [...oldExpanded, nodeId]));
	};

	const clearAllFilters = () => {
		setFilterOptions({
			templates: true,
			categories: true,
			subcategories: true,
		});
		setFilter("");
	};

	return (
		<Box sx={{ height: "calc(100vh - 88px - 11.5rem)", display: "flex", flexDirection: "column" }}>
			<Input
				placeholder="Wyszukaj..."
				variant="soft"
				sx={{ marginBottom: 2 }}
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				startDecorator={
					<Dropdown>
						<MenuButton
							color="primary"
							variant="soft"
							size="md"
							startDecorator={<Icon icon="ph:funnel-bold" />}
							endDecorator={matchCount > 0 && <Badge badgeContent={matchCount} color="primary" sx={{ ml: 2, mr: 1 }} />}
							sx={{ borderRadius: "6px" }}
						>
							Filtruj
						</MenuButton>
						<Menu placement="bottom-start">
							<MenuItem>
								<Checkbox
									label="Nazwy szablonów"
									checked={filterOptions.templates}
									onChange={() => handleFilterOptionChange("templates")}
								/>
							</MenuItem>
							<MenuItem>
								<Checkbox
									label="Nazwy kategorii"
									checked={filterOptions.categories}
									onChange={() => handleFilterOptionChange("categories")}
								/>
							</MenuItem>
							<MenuItem>
								<Checkbox
									label="Nazwy podkategorii"
									checked={filterOptions.subcategories}
									onChange={() => handleFilterOptionChange("subcategories")}
								/>
							</MenuItem>
							<Divider />
							<MenuItem onClick={clearAllFilters} color="danger">
								<Icon icon="ph:x-bold" />
								Wyczyść wszystkie filtry
							</MenuItem>
						</Menu>
					</Dropdown>
				}
				endDecorator={
					<Tooltip title={filter ? "Wyczyść" : "Wyszukaj"} color="primary" variant="soft">
						<IconButton color="primary" variant="soft" size="sm" sx={{ mr: -1, borderRadius: "6px" }} onClick={() => setFilter("")}>
							{filter ? <Icon icon="ph:x-bold" /> : <Icon icon="ph:magnifying-glass-bold" />}
						</IconButton>
					</Tooltip>
				}
			/>

			<Box sx={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "left" }}>
				<SimpleTreeView
					slots={{
						expandIcon: ExpandIcon,
						collapseIcon: CollapseIcon,
					}}
					expandedItems={expandedItems}
					onItemExpansionToggle={handleItemExpansionToggle}
				>
					{filteredCategories.map((category) => (
						<CategoryItem
							key={category.categoryId}
							itemId={category.categoryId}
							name={category.categoryName}
							sx={{
								fontWeight: category.matches && filter ? "bold" : "normal",
								color: category.matches && filter ? "primary.main" : "text.primary",
							}}
						>
							{category.subcategories.map((subcategory) => (
								<CategoryItem
									key={subcategory.subcategoryId}
									itemId={subcategory.subcategoryId}
									name={subcategory.subcategoryName}
									sx={{
										fontWeight: subcategory.matches && filter ? "bold" : "normal",
										color: subcategory.matches && filter ? "primary.main" : "text.primary",
									}}
								>
									{subcategory.templates.map((template) => (
										<StyledTreeItem
											key={template.id}
											itemId={template.id}
											className="tree-item"
											label={
												<Link href={`/templates/${template.id}`}>
													<Typography
														sx={{
															textDecoration: "none",
															color: template.matches && filter ? "primary.main" : "text.primary",
															fontWeight: template.matches && filter ? "bold" : "normal",
														}}
													>
														{template.name}
													</Typography>
												</Link>
											}
										/>
									))}
								</CategoryItem>
							))}
						</CategoryItem>
					))}
				</SimpleTreeView>
			</Box>
		</Box>
	);
}

export default TemplateTree;
