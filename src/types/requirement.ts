import type { TemplateId } from "./template";
import type { User } from "./user";

type RequirementId = string;
type RequirementName = string;

type TextRequirement = {
	elementType: "textReq";
	id: string;
	value: string;
};

type InputRequirement = {
	elementType: "inputReq";
	id: string;
	inputType: "text" | "number";
	placeholder: string;
	value: string | number;
};

type ChoiceRequirement = {
	elementType: "choiceReq";
	id: string;
	placeholder: string;
	options: (ChoiceRequirementOption | string)[];
	selectedOption: string;
};

type ChoiceRequirementOption = {
	elementType: "groupReq";
	id: string;
	label: string;
	value: string;
	content: RequirementElement[];
};

type OptionalRequirement = {
	elementType: "optionalReq";
	id: string;
	placeholder: string;
	enabled: boolean;
	content: RequirementElement[];
};

type RepeatableRequirement = {
	elementType: "repeatableReq";
	id: string;
	placeholder: string;
	required: boolean;
	maxInstances: number;
	content: RequirementElement[];
	instances: RequirementElement[][];
};

type ReferenceRequirement = {
	elementType: "referenceReq";
	id: string;
	placeholder: string;
	refElementID: string;
	refElementCustomID: string;
	refElementName: string;
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
	_id?: string;
	id: RequirementId;
	trashed: boolean;
	trashedAt: Date | null;
	trashedBy: string | User;
	createdAt: Date;
	createdBy: string | User;
	createdThrough: "creator" | "catalogue" | "";
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
