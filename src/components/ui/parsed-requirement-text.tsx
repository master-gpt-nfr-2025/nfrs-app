import React from "react";
import { Typography } from "@mui/joy";
import { Stack } from "@mui/material";

type ParsedRequirementTextProps = {
	parsedText: string;
	color?: "neutral" | "primary";
};

const ParsedRequirementText = React.memo(({ parsedText, color = "primary" }: ParsedRequirementTextProps) => {
	return <Typography color={color}>{parsedText}</Typography>;
});

export default ParsedRequirementText;
