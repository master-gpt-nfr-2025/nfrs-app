import { Requirement, RequirementElement } from "@/types/requirement";

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

	return (
		parseContent(requirement.content).trim().replace(" .", ".") + ".".replace("  ", " ").replace(" )", ")").replace(".", ".").replace(" %", "%")
	);
};

export { parseRequirement };
