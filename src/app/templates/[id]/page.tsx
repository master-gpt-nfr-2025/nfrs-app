import React from "react";
import Template from "@/models/template.model";
import { Chip, Stack, Typography } from "@mui/joy";
import { checkConnection } from "@/config/db";
import { Box } from "@mui/material";
import UseTemplateButton from "@/components/ui/use-template-button";
import { Template as TemplateType } from "@/types/template";
// import RequirementFields from "@/components/ui/requirement-fields";
import { mapTemplate } from "@/lib/mapping";
import RequirementWrapper from "@/components/ui/requirement-wrapper";
import { useRequirementData } from "@/hooks/useRequirementData";

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

	const initialRequirement = await mapTemplate(templateDetails);

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
			</Stack>
			<RequirementWrapper initialRequirement={initialRequirement} />
		</Stack>
	);
}

export default TemplateDetails;
