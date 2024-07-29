"use client";
import { useCreateRequirementFormDialogContext } from "@/context/createRequirementDialogContext";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import React from "react";

const DialogNavigationButtons = () => {
	const { next, back, isFirstStep, isLastStep } = useCreateRequirementFormDialogContext();

	return (
		<Stack direction={"row"} gap={1}>
			{!isFirstStep && (
				<Button onClick={back} startDecorator={<KeyboardArrowLeft />} variant="outlined">
					Wstecz
				</Button>
			)}
			{!isLastStep && (
				<Button onClick={next} endDecorator={<KeyboardArrowRight />}>
					Dalej
				</Button>
			)}
		</Stack>
	);
};

export default DialogNavigationButtons;
