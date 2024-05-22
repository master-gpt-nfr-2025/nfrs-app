import React from "react";
import Category from "@/models/category.model";
import Template from "@/models/template.model";
import { Chip, Stack, Typography } from "@mui/joy";
import { checkConnection } from "@/config/db";
import { Box } from "@mui/material";
import UseTemplateButton from "@/components/ui/use-template-button";

interface IParams {
	params: {
		id: string;
	};
}

interface ITemplate {
	_id: string;
	id: string;
	name: string;
	subcategoryId: string;
}

async function TemplateDetails({ params }: IParams) {
	const fetchTemplate = async () => {
		"use server";
		await checkConnection();
		const template = await Template.findOne({ id: params.id });
		return template;
	};

	const templateDetails: ITemplate = await fetchTemplate();

	return (
		<Stack gap={1}>
			<Stack direction="row" gap={1} justifyContent="space-between">
				<Stack gap={0.5} direction="row">
					<Typography level="title-lg" sx={{ fontWeight: 600, color: "text.tertiary" }}>{`[${templateDetails.subcategoryId.toUpperCase()}-${
						templateDetails.id
					}]`}</Typography>
					<Typography level="title-lg" sx={{ fontWeight: 600 }}>
						{templateDetails.name}
					</Typography>
				</Stack>
				<UseTemplateButton templateId={JSON.parse(JSON.stringify(templateDetails.id))} />
			</Stack>
			<Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 600 }}>
				Dostępne pola
			</Typography>
		</Stack>
	);
}

export default TemplateDetails;
