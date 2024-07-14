import React from "react";
import Template from "@/models/template.model";
import Requirement from "@/models/requirement.model";
import { Stack, Typography } from "@mui/joy";
import { checkConnection } from "@/config/db";
import { Template as TemplateType } from "@/types/template";
import { Requirement as RequirementType } from "@/types/requirement";
// import { mapTemplate } from "@/lib/mapping";
import RequirementWrapper from "@/components/ui/requirement-wrapper";

interface IParams {
	params: {
		id: string;
	};
}

async function RequirementDetails({ params }: IParams) {
	const fetchRequirement = async () => {
		"use server";
		await checkConnection();
		const requirement = await Requirement.findById(params.id);
		return requirement.toJSON();
	};

	const requirementDetails: RequirementType = await fetchRequirement();

	// const initialRequirement = await mapTemplate(templateDetails);

	return (
		<Stack gap={1}>
			<Stack direction="row" gap={1} justifyContent="space-between">
				<Stack gap={0.5} direction="row">
					<Typography
						level="title-lg"
						sx={{ fontWeight: 600, color: "text.tertiary" }}
					>{`[${requirementDetails.subcategoryId.toUpperCase()}-${requirementDetails.id}]`}</Typography>
					<Typography level="title-lg" sx={{ fontWeight: 600 }}>
						{requirementDetails.name}
					</Typography>
				</Stack>
			</Stack>
			{/* <RequirementWrapper initialRequirement={initialRequirement} /> */}
		</Stack>
	);
}

export default RequirementDetails;
