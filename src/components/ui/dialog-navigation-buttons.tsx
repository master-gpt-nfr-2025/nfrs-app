"use client";
import { useCreateRequirementFormDialogContext } from "@/context/createRequirementDialogContext";
import { KeyboardArrowLeft, KeyboardArrowRight, Check } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import React from "react";

type DialogNavigationButtonsProps = {
	nextActive?: boolean;
	submit?: boolean;
};

const DialogNavigationButtons = ({ nextActive, submit }: DialogNavigationButtonsProps) => {
	const { next, back, isFirstStep, isLastStep } = useCreateRequirementFormDialogContext();

	return (
		<Stack direction={"row"} gap={1}>
			{!isFirstStep && (
				<Button onClick={back} startDecorator={<KeyboardArrowLeft />} variant="outlined">
					Wstecz
				</Button>
			)}
			{!isLastStep && (
				<Button onClick={next} endDecorator={<KeyboardArrowRight />} disabled={!nextActive}>
					Dalej
				</Button>
			)}
			{isLastStep && submit && (
				<Button onClick={next} endDecorator={<Check />} type="submit">
					Utwórz
				</Button>
			)}
		</Stack>
	);
};

export default DialogNavigationButtons;
