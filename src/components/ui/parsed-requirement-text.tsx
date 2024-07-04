import React from "react";
import { Typography } from "@mui/joy";
import { Stack } from "@mui/material";

type ParsedRequirementTextProps = {
	parsedText: string;
};

const ParsedRequirementText = React.memo(({ parsedText }: ParsedRequirementTextProps) => {
	return <Typography color="primary">{parsedText}</Typography>;
});

export default ParsedRequirementText;
