"use client";
import { useRequirementData } from "@/hooks/useRequirementData";
import ParsedRequirementText from "./parsed-requirement-text";
import RequirementFields from "@/components/ui/requirement-fields";
import { Requirement } from "@/types/requirement";
import { Stack, Typography } from "@mui/joy";

const RequirementWrapper = ({ initialRequirement }: { initialRequirement: Requirement }) => {
	const { requirement, parsedText, updateRequirement } = useRequirementData(initialRequirement);

	return (
		<Stack gap={2}>
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
