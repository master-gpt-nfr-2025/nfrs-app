import { TemplateId } from "./template";

type RequirementId = string;
type RequirementName = string;

type TextRequirement = {
	elementType: "text";
	id: string;
	value: string;
};

type InputRequirement = {
	elementType: "input";
	id: string;
	inputType: "text" | "number";
	placeholder: string;
	value: string | number;
};

type ChoiceRequirement = {
	elementType: "choice";
	id: string;
	placeholder: string;
	options: (ChoiceRequirementOption | string)[];
	selectedOption: string;
};

type ChoiceRequirementOption = {
	elementType: "group";
	id: string;
	label: string;
	value: string;
	content: RequirementElement[];
};

type OptionalRequirement = {
	elementType: "optional";
	id: string;
	placeholder: string;
	enabled: boolean;
	content: RequirementElement[];
};

type RepeatableRequirement = {
	elementType: "repeatable";
	id: string;
	placeholder: string;
	required: boolean;
	maxInstances: number;
	content: RequirementElement[];
	instances: RequirementElement[][];
};

type ReferenceRequirement = {
	elementType: "reference";
	id: string;
	placeholder: string;
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
	categoryId: string;
	subcategoryId: string;
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
