"use client";
import FillTemplate from "@/components/createRequirementDialog/fill-template";
import SelectCategory from "@/components/createRequirementDialog/select-category";
import SelectTemplate from "@/components/createRequirementDialog/select-template";
import { CreateRequirementForm } from "@/context/createRequirementDialogContext";
import { fetchCategories } from "@/lib/actions-categories";
import { fetchTemplateDetails, fetchTemplatesForSubcategory } from "@/lib/actions-templates";
import { Box, Stack } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import { mapTemplate } from "@/lib/mapping";
import { Requirement } from "@/types/requirement";

export type CategoryType = {
	_id: string;
	categoryName: string;
	subcategories: {
		_id: string;
		subcategoryName: string;
		subcategoryId: string;
		description: string;
		icon: string;
	}[];
};

const CreateRequirement = () => {
	const navigationButtonsRef = useRef<HTMLDivElement>(null);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [loadingTemplates, setLoadingTemplates] = useState(false);

	const [categories, setCategories] = useState<CategoryType[]>([]);
	const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
	const [templates, setTemplates] = useState<any[]>([]);
	const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
	const [templateFields, setTemplateFields] = useState<Requirement | null>(null);

	const handleSubcategorySelect = (subcategoryId: string | null) => {
		setSelectedSubcategory(subcategoryId);
		if (navigationButtonsRef.current) {
			navigationButtonsRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	useEffect(() => {
		const fetchCategoriesData = async () => {
			const data = await fetchCategories();
			setCategories(data);
		};
		setLoadingCategories(true);
		fetchCategoriesData();
		setLoadingCategories(false);
	}, []);

	const handleTemplateSelect = (templateId: string | null) => {
		setSelectedTemplate(templateId);
		if (navigationButtonsRef.current) {
			navigationButtonsRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	useEffect(() => {
		const fetchTemplatesData = async () => {
			if (selectedSubcategory) {
				const data = await fetchTemplatesForSubcategory(selectedSubcategory);
				setTemplates(data);
			}
		};
		fetchTemplatesData();
	}, [selectedSubcategory]);

	useEffect(() => {
		const fetchTemplate = async () => {
			if (selectedTemplate) {
				const data = await fetchTemplateDetails(selectedTemplate);
				const fields = await mapTemplate(data);
				setTemplateFields(fields);
			}
		};
		fetchTemplate();
	}, [selectedTemplate]);

	const steps = [
		<SelectCategory
			key={Math.random() * 100 + "st"}
			categories={categories}
			selectedSubcategory={selectedSubcategory}
			onSubcategorySelect={handleSubcategorySelect}
			loading={loadingCategories}
		/>,
		<SelectTemplate
			key={Math.random() * 100 + "nd"}
			templates={templates}
			selectedTemplate={selectedTemplate}
			onTemplateSelect={handleTemplateSelect}
			loading={loadingTemplates}
		/>,
		templateFields ? <FillTemplate key={Math.random() * 100 + "rd"} initialRequirement={templateFields} /> : <></>,
	];

	return (
		<Box
			sx={{
				minHeight: "calc(100vh - 88px - 11.5rem)",
			}}
		>
			<CreateRequirementForm>{steps}</CreateRequirementForm>
		</Box>
	);
};

export default CreateRequirement;
