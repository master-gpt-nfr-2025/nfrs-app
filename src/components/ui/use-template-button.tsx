"use client";
import { Icon } from "@iconify/react";
import { Button } from "@mui/joy";
import React, { useState } from "react";
import { Requirement } from "@/types/requirement";
import UseTemplateModal from "./use-template-modal";

type UseTemplateButtonProps = {
	requirement: Requirement;
};

const UseTemplateButton = ({ requirement }: UseTemplateButtonProps) => {
	const [open, setOpen] = useState<boolean>(false);
	const handleClick = () => {
		console.log("Template ID: ", requirement.templateId);
		setOpen(true);
	};

	return (
		<>
			<Button color="primary" variant="soft" startDecorator={<Icon icon="ph:plus-bold" />} onClick={handleClick}>
				Użyj szablonu
			</Button>
			<UseTemplateModal open={open} setOpen={setOpen} requirement={requirement} />
		</>
	);
};

export default UseTemplateButton;
