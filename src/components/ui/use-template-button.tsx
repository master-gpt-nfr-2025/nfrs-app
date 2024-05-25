"use client";
import { Icon } from "@iconify/react";
import { Button } from "@mui/joy";
import React, { useState } from "react";
import CreateRequirementFromTemplateModal from "./create-requirement-from-template-modal";
import { Template } from "@/types/template";

type UseTemplateButtonProps = {
	template: Template;
};

const UseTemplateButton = ({ template }: UseTemplateButtonProps) => {
	const [open, setOpen] = useState<boolean>(false);
	const handleClick = () => {
		console.log("Template ID: ", template.id);
		setOpen(true);
	};

	return (
		<>
			<Button color="primary" variant="soft" startDecorator={<Icon icon="ph:plus-bold" />} onClick={handleClick}>
				Użyj szablonu
			</Button>
			<CreateRequirementFromTemplateModal open={open} setOpen={setOpen} template={template} />
		</>
	);
};

export default UseTemplateButton;
