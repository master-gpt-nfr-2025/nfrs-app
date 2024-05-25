import React from "react";
import Category from "@/models/category.model";
import Template from "@/models/template.model";
import { Chip, Stack, Typography } from "@mui/joy";
import { checkConnection } from "@/config/db";
import { Box } from "@mui/material";
import UseTemplateButton from "@/components/ui/use-template-button";
import { Template as TemplateType } from "@/types/template";
import TemplateFields from "@/components/ui/template-fields";

interface IParams {
	params: {
		id: string;
	};
}

async function TemplateDetails({ params }: IParams) {
	const fetchTemplate = async () => {
		"use server";
		await checkConnection();
		const template = await Template.findOne({ id: params.id });
		return template.toJSON();
	};

	const templateDetails: TemplateType = await fetchTemplate();

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
				<UseTemplateButton template={JSON.parse(JSON.stringify(templateDetails))} />
			</Stack>
			<Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 600 }}>
				Dostępne pola
			</Typography>
			<TemplateFields content={JSON.parse(JSON.stringify(templateDetails.content))} />
		</Stack>
	);
}

export default TemplateDetails;
