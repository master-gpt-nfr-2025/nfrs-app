"use server";
import {
	ChoiceRequirement,
	ChoiceRequirementOption,
	InputRequirement,
	OptionalRequirement,
	ReferenceRequirement,
	RepeatableRequirement,
	Requirement as RequirementType,
	RequirementElement,
	TextRequirement,
} from "@/types/requirement";
import {
	ChoiceElement,
	ChoiceElementOption,
	InputElement,
	OptionalElement,
	ReferenceElement,
	RepeatableElement,
	Template,
	TemplateElement,
	TextElement,
} from "@/types/template";
import RequirementModel from "@/models/requirement.model";

export async function mapTemplate(template: Template): Promise<RequirementType> {
	return {
		custom: template.custom,
		id: await generateRequirementId(), // Generate unique requirement ID
		trashed: false,
		trashedAt: null,
		trashedBy: "",
		createdAt: new Date(),
		createdBy: "",
		createdThrough: "",
		categoryId: template.categoryId,
		subcategoryId: template.subcategoryId,
		name: template.name,
		templateId: template.id,
		content: mapTemplateElements(template.content),
	};
}

function generateElementId(element: TemplateElement, index: number): string {
	const typeMap: { [key: string]: string } = {
		text: "TXT",
		input: "INP",
		choice: "CHO",
		optional: "OPT",
		repeatable: "REP",
		reference: "REF",
		group: "GRP",
	};

	const typeId = typeMap[element.elementType] || "UNK";
	const uniqueNumber = generateUniqueNumber(element, index);

	return `${typeId}-${uniqueNumber}`;
}

function generateUniqueNumber(element: TemplateElement, index: number): string {
	const contentHash = hashCode(JSON.stringify(element));
	const indexHash = hashCode(String(index));

	const combinedHash = contentHash ^ indexHash;
	const uniqueNumber = Math.abs(combinedHash % 1000000);

	return String(uniqueNumber).padStart(6, "0");
}

function hashCode(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return hash;
}

export async function generateRequirementId(): Promise<string> {
	const count = await RequirementModel.countDocuments();

	return `REQ-${(count + 1).toString().padStart(4, "0")}`;
}

// Update the mapping functions to pass the index

function mapTemplateElements(elements: TemplateElement[]): RequirementElement[] {
	return elements?.map((element, index) => mapTemplateElement(element, index));
}

function mapTemplateElement(element: TemplateElement, index: number): RequirementElement {
	switch (element.elementType) {
		case "text":
			return mapTextElement(element, index);
		case "input":
			return mapInputElement(element, index);
		case "choice":
			return mapChoiceElement(element, index);
		case "optional":
			return mapOptionalElement(element, index);
		case "repeatable":
			return mapRepeatableElement(element, index);
		case "reference":
			return mapReferenceElement(element, index);
		default:
			throw new Error(`Unknown template element type: ${element.elementType}`);
	}
}

function mapTextElement(element: TextElement, index: number): TextRequirement {
	return {
		elementType: `${element.elementType}Req`,
		id: generateElementId(element, index),
		value: element.value,
	};
}

function mapInputElement(element: InputElement, index: number): InputRequirement {
	return {
		elementType: `${element.elementType}Req`,
		id: generateElementId(element, index),
		inputType: element.inputType,
		placeholder: element.placeholder,
		value: "",
	};
}

function mapChoiceElement(element: ChoiceElement, index: number): ChoiceRequirement {
	return {
		elementType: `${element.elementType}Req`,
		id: generateElementId(element, index),
		placeholder: element.placeholder,
		options: element.options.map((option, optionIndex) => mapChoiceOption(option, optionIndex)),
		selectedOption: "",
	};
}

function mapChoiceOption(option: ChoiceElementOption | string, index: number): ChoiceRequirementOption | string {
	if (typeof option === "string") {
		return option;
	}

	return {
		elementType: `${option.elementType}Req`,
		id: generateElementId(option, index),
		label: option.label,
		value: option.value,
		content: mapTemplateElements(option.content),
	};
}

function mapOptionalElement(element: OptionalElement, index: number): OptionalRequirement {
	return {
		elementType: `${element.elementType}Req`,
		id: generateElementId(element, index),
		placeholder: element.placeholder,
		enabled: false,
		content: mapTemplateElements(element.content),
	};
}

function mapRepeatableElement(element: RepeatableElement, index: number): RepeatableRequirement {
	return {
		elementType: `${element.elementType}Req`,
		id: generateElementId(element, index),
		placeholder: element.placeholder,
		required: element.required,
		maxInstances: element.maxInstances,
		content: mapTemplateElements(element.content),
		instances: [],
	};
}

function mapReferenceElement(element: ReferenceElement, index: number): ReferenceRequirement {
	return {
		elementType: `${element.elementType}Req`,
		id: generateElementId(element, index),
		placeholder: element.placeholder,
		refElementID: "",
		refElementCustomID: "",
		refElementName: "",
	};
}
