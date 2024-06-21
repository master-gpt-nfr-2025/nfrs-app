import React from "react";
import { Typography } from "@mui/joy";
import { parseRequirement } from "@/lib/utils";
import { Requirement } from "@/types/requirement";

type ParsedRequirementTextProps = {
	requirement?: Requirement;
};

const ParsedRequirementText = ({ requirement }: ParsedRequirementTextProps) => {
	const parsedText = parseRequirement(requirement || ({} as Requirement));

	return <Typography>{parsedText}</Typography>;
};

export default ParsedRequirementText;
