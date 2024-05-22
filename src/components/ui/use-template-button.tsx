"use client";
import { Icon } from "@iconify/react";
import { Button } from "@mui/joy";
import React from "react";

type UseTemplateButtonProps = {
	templateId: string;
};

const UseTemplateButton = ({ templateId }: UseTemplateButtonProps) => {
	const handleClick = () => {
		console.log("Template ID: ", templateId);
	};

	return (
		<Button color="primary" variant="soft" startDecorator={<Icon icon="ph:plus-bold" />} onClick={handleClick}>
			Użyj szablonu
		</Button>
	);
};

export default UseTemplateButton;
