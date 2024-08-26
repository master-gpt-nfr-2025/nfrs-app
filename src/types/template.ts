type TemplateId = string;
type TemplateName = string;

type TextElement = {
	elementType: "text";
	value: string;
};

type InputElement = {
	elementType: "input";
	inputType: "text" | "number";
	placeholder: string;
};

type ChoiceElement = {
	elementType: "choice";
	placeholder: string;
	options: (ChoiceElementOption | string)[];
};

type ChoiceElementOption = {
	elementType: "group";
	label: string;
	value: string;
	content: TemplateElement[];
};

type OptionalElement = {
	elementType: "optional";
	placeholder: string;
	content: TemplateElement[];
};

type RepeatableElement = {
	elementType: "repeatable";
	placeholder: string;
	required: boolean;
	maxInstances: number;
	content: TemplateElement[];
};

type ReferenceElement = {
	elementType: "reference";
	placeholder: string;
};

type TemplateElement = TextElement | InputElement | ChoiceElement | ChoiceElementOption | OptionalElement | RepeatableElement | ReferenceElement;

type Template = {
	custom: boolean;
	id: TemplateId;
	categoryId: string;
	subcategoryId: string;
	name: TemplateName;
	description: string;
	content: TemplateElement[];
};

export type {
	Template,
	TemplateElement,
	TemplateId,
	TemplateName,
	TextElement,
	InputElement,
	ChoiceElement,
	ChoiceElementOption,
	OptionalElement,
	RepeatableElement,
	ReferenceElement,
};
