import {
	ChoiceRequirement,
	InputRequirement,
	OptionalRequirement,
	ReferenceRequirement,
	RepeatableRequirement,
	Requirement,
	RequirementElement,
} from "@/types/requirement";

const parseRequirement = (requirement: Requirement): string => {
	const parseContent = (content: RequirementElement[]): string => {
		return content
			.map((field) => {
				switch (field.elementType) {
					case "text":
						return field.value;
					case "input":
						return field.value.toString();
					case "choice":
						return field.options
							.filter((option) => {
								if (typeof option === "string") {
									return option === field.selectedOption;
								} else {
									return option.value === field.selectedOption;
								}
							})
							.map((option) => {
								if (typeof option !== "string") {
									return parseContent(option.content);
								} else {
									return option;
								}
							})
							.join("");
					case "optional":
						return field.enabled ? parseContent(field.content) : "";
					case "repeatable":
						const instances = field.instances.map((instance) => parseContent(instance));
						if (instances.length > 1) {
							const lastInstance = instances.pop();
							return instances.join(", ") + " oraz " + lastInstance;
						} else {
							return instances.join("");
						}
					case "reference":
						return ""; // Handle reference parsing if needed
					default:
						return "";
				}
			})
			.join(" ");
	};

	return parseContent(requirement.content).trim().replace(" .", ".") + ".".replace("  ", " ").replace(" )", ")").replace(".", ".");
};

const updateRequirementContent = (content: RequirementElement[], fieldId: string, updatedData: Partial<RequirementElement>): RequirementElement[] => {
	const dfs = (elements: RequirementElement[]): RequirementElement[] => {
		return elements.map((field) => {
			if (field.id === fieldId) {
				switch (field.elementType) {
					case "input":
						return { ...field, ...(updatedData as Partial<InputRequirement>) };
					case "choice":
						return { ...field, ...(updatedData as Partial<ChoiceRequirement>) };
					case "optional":
						return {
							...field,
							content: dfs(field.content),
							...(updatedData as Partial<OptionalRequirement>),
						};
					case "repeatable":
						return {
							...field,
							instances: field.instances.map((instance) => dfs(instance)),
							...(updatedData as Partial<RepeatableRequirement>),
						};
					case "reference":
						return { ...field, ...(updatedData as Partial<ReferenceRequirement>) };
					default:
						return field;
				}
			}
			if (field.elementType === "optional") {
				return {
					...field,
					content: dfs(field.content),
				};
			}
			if (field.elementType === "repeatable") {
				return {
					...field,
					instances: field.instances.map((instance) => dfs(instance)),
				};
			}
			if (field.elementType === "choice") {
				return {
					...field,
					options: field.options.map((option) => {
						if (typeof option !== "string" && option.elementType === "group") {
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

export { parseRequirement, updateRequirementContent };
