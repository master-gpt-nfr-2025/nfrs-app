type TemplateId = string;
type TemplateName = string;

type TextElement = {
	type: "text";
	value: string;
};

type InputElement = {
	type: "input";
	inputType: "text" | "number";
	placeholder: string;
};

type ChoiceElement = {
	type: "choice";
	placeholder: string;
	options: (ChoiceElementOption | string)[];
};

type ChoiceElementOption = {
	type: "group";
	label: string;
	value: string;
	content: TemplateElement[];
};

type OptionalElement = {
	type: "optional";
	placeholder: string;
	content: TemplateElement[];
};

type RepeatableElement = {
	type: "repeatable";
	placeholder: string;
	maxInstances: number;
	content: TemplateElement[];
};

type ReferenceElement = {
	type: "reference";
	refType: string;
	refId: string;
};

type TemplateElement = TextElement | InputElement | ChoiceElement | ChoiceElementOption | OptionalElement | RepeatableElement | ReferenceElement;

type Template = {
	id: TemplateId;
	name: TemplateName;
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
