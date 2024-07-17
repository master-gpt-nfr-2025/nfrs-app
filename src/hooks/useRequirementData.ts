import { useRef, useState, useCallback } from "react";
import {
	ChoiceRequirement,
	InputRequirement,
	OptionalRequirement,
	ReferenceRequirement,
	RepeatableRequirement,
	Requirement,
	RequirementElement,
} from "@/types/requirement";
import { parseRequirement } from "@/lib/utils";

export const useRequirementData = (initialRequirement: Requirement) => {
	const requirementRef = useRef<Requirement>(initialRequirement);
	const [parsedText, setParsedText] = useState(() => parseRequirement(initialRequirement));

	const updateRequirementContent = (
		content: RequirementElement[],
		fieldId: string,
		updatedData: Partial<RequirementElement>
	): RequirementElement[] => {
		const dfs = (elements: RequirementElement[]): RequirementElement[] => {
			return elements.map((field) => {
				if (field.id === fieldId) {
					switch (field.elementType) {
						case "inputReq":
							return { ...field, ...(updatedData as Partial<InputRequirement>) };
						case "choiceReq":
							return { ...field, ...(updatedData as Partial<ChoiceRequirement>) };
						case "optionalReq":
							return {
								...field,
								content: dfs(field.content),
								...(updatedData as Partial<OptionalRequirement>),
							};
						case "repeatableReq":
							return {
								...field,
								instances: (updatedData as Partial<RepeatableRequirement>).instances
									? (updatedData as Partial<RepeatableRequirement>).instances!.map(dfs)
									: field.instances.map(dfs),
							};
						case "referenceReq":
							return { ...field, ...(updatedData as Partial<ReferenceRequirement>) };
						default:
							return field;
					}
				}
				if (field.elementType === "optionalReq") {
					return {
						...field,
						content: dfs(field.content),
					};
				}
				if (field.elementType === "repeatableReq") {
					return {
						...field,
						instances: field.instances.map(dfs),
					};
				}
				if (field.elementType === "choiceReq") {
					return {
						...field,
						options: field.options.map((option) => {
							if (typeof option !== "string" && option.elementType === "groupReq") {
								return {
									...option,
									content: dfs(option.content),
								};
							}
							return option;
						}),
					};
				}
				return field;
			});
		};

		return dfs(content);
	};

	const updateRequirement = useCallback((fieldId: string, updatedData: Partial<RequirementElement>) => {
		requirementRef.current = {
			...requirementRef.current,
			content: updateRequirementContent(requirementRef.current.content, fieldId, updatedData),
		};
		setParsedText(parseRequirement(requirementRef.current));
	}, []);

	return {
		requirement: requirementRef.current,
		parsedText,
		updateRequirement,
	};
};
