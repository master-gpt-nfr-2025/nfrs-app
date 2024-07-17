import { Requirement, RequirementElement } from "@/types/requirement";

const parseRequirement = (requirement: Requirement): string => {
	const parseContent = (content: RequirementElement[]): string => {
		return content
			.map((field) => {
				switch (field.elementType) {
					case "textReq":
						return field.value;
					case "inputReq":
						return field.value.toString();
					case "choiceReq":
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
					case "optionalReq":
						return field.enabled ? parseContent(field.content) : "";
					case "repeatableReq":
						const instances = field.instances.map((instance) => parseContent(instance));
						if (instances.length > 1) {
							const lastInstance = instances.pop();
							return instances.join(", ") + " oraz " + lastInstance;
						} else {
							return instances.join("");
						}
					case "referenceReq":
						return ""; // Handle reference parsing if needed
					default:
						return "";
				}
			})
			.join(" ");
	};

	return (
		parseContent(requirement.content).trim().replace(" .", ".") + ".".replace("  ", " ").replace(" )", ")").replace(".", ".").replace(" %", "%")
	);
};

export { parseRequirement };
