import { TemplateId } from "./template";

type RequirementId = string;
type RequirementName = string;

type TextRequirement = {
	type: "text";
	id: string;
	value: string;
};

type InputRequirement = {
	type: "input";
	id: string;
	inputType: "text" | "number";
	placeholder: string;
	value: string | number;
};

type ChoiceRequirement = {
	type: "choice";
	id: string;
	placeholder: string;
	options: (ChoiceRequirementOption | string)[];
	selectedOption: string;
};

type ChoiceRequirementOption = {
	type: "group";
	id: string;
	label: string;
	value: string;
	content: RequirementElement[];
};

type OptionalRequirement = {
	type: "optional";
	id: string;
	placeholder: string;
	enabled: boolean;
	content: RequirementElement[];
};

type RepeatableRequirement = {
	type: "repeatable";
	id: string;
	placeholder: string;
	maxInstances: number;
	content: RequirementElement[];
	instances: RequirementElement[][];
};

type ReferenceRequirement = {
	type: "reference";
	id: string;
	placeholder: string;
	refType: string;
	refId: string;
};

type RequirementElement =
	| TextRequirement
	| InputRequirement
	| ChoiceRequirement
	| ChoiceRequirementOption
	| OptionalRequirement
	| RepeatableRequirement
	| ReferenceRequirement;

type Requirement = {
	id: RequirementId;
	name: RequirementName;
	templateId: TemplateId;
	content: RequirementElement[];
};

export type {
	Requirement,
	RequirementElement,
	RequirementId,
	RequirementName,
	TextRequirement,
	InputRequirement,
	ChoiceRequirement,
	ChoiceRequirementOption,
	OptionalRequirement,
	RepeatableRequirement,
	ReferenceRequirement,
};
