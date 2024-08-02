import DialogNavigationButtons from "@/components/ui/dialog-navigation-buttons";
import { useMultiStepForm } from "@/hooks/useMultistepForm";
import { Check } from "@mui/icons-material";
import { Box, Stack, Step, StepButton, StepIndicator, Stepper } from "@mui/joy";
import { createContext, forwardRef, useContext, useRef, useState } from "react";

type CreateRequirementFormDialogContextType = {
	currentStepIndex: number;
	step: React.ReactElement;
	steps: React.ReactElement[];
	isFirstStep: boolean;
	isLastStep: boolean;
	goTo: (index: number) => void;
	next: () => void;
	back: () => void;
};

const CreateRequirementFormDialogContext = createContext<CreateRequirementFormDialogContextType | undefined>(undefined);

const stepLabels = ["Kategoria", "Szablon", "Treść"];

type CreateRequirementFormDialogProps = {
	children: React.ReactElement[];
};

const CreateRequirementFormDialog = ({ children }: CreateRequirementFormDialogProps) => {
	const { currentStepIndex, step, steps, isFirstStep, isLastStep, goTo, next, back } = useMultiStepForm(children);
	const [activeStep, setActiveStep] = useState(1);

	return (
		<Box>
			<Stepper sx={{ width: "100%", mb: "1rem" }}>
				{stepLabels.map((step, index) => (
					<Step
						key={index}
						indicator={
							<StepIndicator variant={activeStep <= index ? "soft" : "solid"} color={activeStep < index ? "neutral" : "primary"}>
								{activeStep <= index ? index + 1 : <Check />}
							</StepIndicator>
						}
						sx={{
							"&::after": {
								...(activeStep > index && index !== 2 && { bgcolor: "primary.solidBg" }),
							},
						}}
					>
						<StepButton
							onClick={() => {
								setActiveStep(index);
								goTo(index);
							}}
						>
							{step}
						</StepButton>
					</Step>
				))}
			</Stepper>
			<CreateRequirementFormDialogContext.Provider value={{ currentStepIndex, steps, step, isFirstStep, isLastStep, goTo, next, back }}>
				<Stack spacing={1}>{steps[currentStepIndex]}</Stack>
			</CreateRequirementFormDialogContext.Provider>
		</Box>
	);
};

CreateRequirementFormDialog.displayName = "CreateRequirementFormDialog";

const useCreateRequirementFormDialogContext = () => {
	const context = useContext(CreateRequirementFormDialogContext);
	if (context === undefined) {
		throw new Error("useMultiStepFormContext must be used within a MultiStepForm");
	}
	return context;
};

export { CreateRequirementFormDialog, useCreateRequirementFormDialogContext };
