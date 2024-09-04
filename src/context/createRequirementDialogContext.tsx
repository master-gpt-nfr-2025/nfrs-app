import { useMultiStepForm } from "@/hooks/useMultistepForm";
import { Check, CheckRounded } from "@mui/icons-material";
import { Box, Stack, Step, StepButton, StepIndicator, Stepper } from "@mui/joy";
import { createContext, forwardRef, useContext, useRef, useState } from "react";

type CreateRequirementFormContextType = {
	currentStepIndex: number;
	step: React.ReactElement;
	steps: React.ReactElement[];
	isFirstStep: boolean;
	isLastStep: boolean;
	goTo: (index: number) => void;
	next: () => void;
	back: () => void;
	setActiveStep: (index: number) => void;
};

const CreateRequirementFormContext = createContext<CreateRequirementFormContextType | undefined>(undefined);

const stepLabels = ["Kategoria", "Szablon", "Treść"];

type CreateRequirementFormProps = {
	children: React.ReactElement[];
	custom?: boolean;
};

const CreateRequirementForm = ({ children, custom }: CreateRequirementFormProps) => {
	const { currentStepIndex, step, steps, isFirstStep, isLastStep, goTo, next, back } = useMultiStepForm(children);
	const [activeStep, setActiveStep] = useState(1);

	return (
		<Box>
			{!custom && (
				<Stepper sx={{ width: "100%", mb: "1rem" }}>
					{stepLabels.map((step, index) => (
						<Step
							key={index}
							indicator={
								<StepIndicator
									variant={activeStep < index ? "outlined" : activeStep === index ? "soft" : "solid"}
									color={activeStep < index ? "neutral" : "primary"}
								>
									{activeStep <= index ? index + 1 : <CheckRounded />}
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
									// setActiveStep(index);
									// goTo(index);
								}}
							>
								{step}
							</StepButton>
						</Step>
					))}
				</Stepper>
			)}
			<CreateRequirementFormContext.Provider
				value={{ currentStepIndex, steps, step, isFirstStep, isLastStep, goTo, next, back, setActiveStep }}
			>
				<Stack spacing={1}>{steps[currentStepIndex]}</Stack>
			</CreateRequirementFormContext.Provider>
		</Box>
	);
};

CreateRequirementForm.displayName = "CreateRequirementForm";

const useCreateRequirementFormContext = () => {
	const context = useContext(CreateRequirementFormContext);
	if (context === undefined) {
		throw new Error("useMultiStepFormContext must be used within a MultiStepForm");
	}
	return context;
};

export { CreateRequirementForm, useCreateRequirementFormContext };
