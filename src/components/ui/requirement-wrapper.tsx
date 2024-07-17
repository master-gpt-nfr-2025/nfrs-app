"use client";
import { useRequirementData } from "@/hooks/useRequirementData";
import ParsedRequirementText from "./parsed-requirement-text";
import RequirementFields from "@/components/ui/requirement-fields";
import { Requirement } from "@/types/requirement";
import { Button, Chip, Divider, FormControl, FormHelperText, FormLabel, Input, Stack, Typography } from "@mui/joy";
import UseTemplateButton from "./use-template-button";
import { useState } from "react";

type RequirementWrapperProps = {
	initialRequirement: Requirement;
};

const RequirementWrapper = ({ initialRequirement }: RequirementWrapperProps) => {
	const { requirement, parsedText, updateRequirement } = useRequirementData(initialRequirement);

	return (
		<Stack gap={2}>
			<Stack direction="row" gap={1} justifyContent="space-between">
				<Stack direction="row" spacing={1}>
					<Chip color="neutral" variant="outlined">
						Pola obowiązkowe
					</Chip>
					<Chip color="neutral" variant="soft">
						Pola opcjonalne
					</Chip>
				</Stack>
				<UseTemplateButton requirement={requirement} />
			</Stack>
			<Stack gap={1}>
				<Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 600 }}>
					Dostępne pola
				</Typography>
				<RequirementFields requirement={requirement} updateRequirement={updateRequirement} />
			</Stack>
			<Stack gap={1}>
				<Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 600 }}>
					Treść wymagania
				</Typography>
				<ParsedRequirementText parsedText={parsedText} />
			</Stack>
		</Stack>
	);
};

export default RequirementWrapper;
