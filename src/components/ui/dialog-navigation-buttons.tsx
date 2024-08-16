"use client";
import { useCreateRequirementFormContext } from "@/context/createRequirementDialogContext";
import { KeyboardArrowLeft, KeyboardArrowRight, Check, Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import React, { forwardRef } from "react";

type DialogNavigationButtonsProps = {
	nextActive?: boolean;
	submit?: boolean;
};

const DialogNavigationButtons = forwardRef<HTMLDivElement, DialogNavigationButtonsProps>(
	({ nextActive, submit }: DialogNavigationButtonsProps, ref) => {
		const { next, back, isFirstStep, isLastStep, currentStepIndex, setActiveStep } = useCreateRequirementFormContext();

		const handleBack = () => {
			setActiveStep(currentStepIndex - 1);
			back();
		};

		const handleNext = () => {
			setActiveStep(currentStepIndex + 1);
			next();
		};

		return (
			<Stack direction={"row"} gap={1} ref={ref}>
				{!isFirstStep && (
					<Button onClick={handleBack} startDecorator={<KeyboardArrowLeft />} variant="outlined">
						Wstecz
					</Button>
				)}
				{!isLastStep && (
					<Button onClick={handleNext} endDecorator={<KeyboardArrowRight />} disabled={!nextActive}>
						Dalej
					</Button>
				)}
				{isLastStep && submit && (
					<Button onClick={handleNext} endDecorator={<Add />} type="submit">
						Zapisz wymaganie
					</Button>
				)}
			</Stack>
		);
	}
);

export default DialogNavigationButtons;
