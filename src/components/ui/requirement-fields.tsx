"use client";
import styles from "@/styles/template-form";
import {
	ChoiceRequirement,
	ChoiceRequirementOption,
	InputRequirement,
	OptionalRequirement,
	ReferenceRequirement,
	RepeatableRequirement,
	RequirementElement,
	TextRequirement,
} from "@/types/requirement";
import { Box, Input, Select, Typography, Option, Button } from "@mui/joy";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

type RequirementFieldsProps = {
	dirty: boolean;
	setDirty: (dirty: boolean) => void;
	name: string;
	content: RequirementElement[];
};

const RequirementFields = ({ content }: RequirementFieldsProps) => {
	interface TextRequirementProps {
		field: TextRequirement;
	}

	const TextComponent = ({ field }: TextRequirementProps) => {
		return <Typography sx={{ zIndex: 1 }}>{field.value}</Typography>;
	};

	interface InputRequirementProps {
		field: InputRequirement;
	}

	const InputComponent = ({ field }: InputRequirementProps) => {
		const maxWidth = () => {
			if (field.inputType === "number") {
				return 100;
			} else {
				return "auto";
			}
		};

		return (
			<Input
				variant="outlined"
				color="neutral"
				sx={(styles.transition, { maxWidth: maxWidth() })}
				type={field.inputType}
				placeholder={field.placeholder}
			/>
		);
	};

	interface ChoiceRequirementProps {
		field: ChoiceRequirement;
	}

	const ChoiceComponent = ({ field }: ChoiceRequirementProps) => {
		const dynamicField = {
			...field,
			selectedOption: "",
		};

		const [selected, setSelected] = useState(dynamicField.selectedOption);

		const handleChoiceChange = (event: React.SyntheticEvent | null, newValue: string | null) => {
			setSelected(newValue!);
		};

		const renderSelectedOption = (options: (ChoiceRequirementOption | string)[]) => {
			return options.map((option) => {
				if (typeof option === "string") {
					return null;
				} else if (option.value === selected) {
					return (
						<Box key={option.value} sx={styles.horizontal}>
							{option.content.map((content, index) => renderField(content, index))}
						</Box>
					);
				}
			});
		};

		const maxLength = () => {
			let maxOptionLength = 0;
			const elements = [...field.options, field.placeholder];

			let optionLength = 0;
			elements.forEach((option) => {
				if (typeof option === "string") {
					optionLength = option.length;
				} else {
					optionLength = option.label.length;
				}
				if (optionLength > maxOptionLength) {
					maxOptionLength = optionLength;
				}
			});

			return maxOptionLength;
		};

		return (
			<Box sx={styles.horizontal}>
				<Select
					placeholder={field.placeholder}
					value={selected}
					onChange={handleChoiceChange}
					variant="outlined"
					color="neutral"
					sx={{ width: maxLength() * 9 + 50, ...styles.transition, zIndex: 1 }}
				>
					{field.options.map((option, index) => {
						if (typeof option === "string") {
							return (
								<Option key={index} value={option} sx={styles.transition}>
									{option}
								</Option>
							);
						}
						return (
							<Option key={option.value} value={option.value} sx={styles.transition}>
								{option.label}
							</Option>
						);
					})}
				</Select>
				{renderSelectedOption(field.options)}
			</Box>
		);
	};

	interface OptionalRequirementProps {
		field: OptionalRequirement;
	}

	const OptionalComponent = ({ field }: OptionalRequirementProps) => {
		const dynamicField = {
			...field,
			enabled: false,
		};

		const [enabled, setEnabled] = useState(dynamicField.enabled);

		const handleEnable = () => {
			setEnabled(true);
		};

		const handleDisable = () => {
			setEnabled(false);
		};

		const renderContent = () => {
			if (!enabled) {
				return (
					<Button
						sx={(styles.transition, { fontWeight: 400 })}
						variant="outlined"
						color="neutral"
						endDecorator={<Icon icon="ph:plus-bold" />}
						onClick={handleEnable}
					>
						{field.placeholder}
					</Button>
				);
			} else {
				return (
					<Box sx={styles.optionalField}>
						{field.content.map((nestedField, index) => renderField(nestedField, index))}
						<Box onClick={handleDisable} className="remove-button" sx={styles.removeButton}>
							<Icon icon="ph:x-bold" />
						</Box>
					</Box>
				);
			}
		};

		return renderContent();
	};

	interface RepeatableRequirementProps {
		field: RepeatableRequirement;
	}

	type Repeatable = {
		instances: RequirementElement[][];
	};

	const RepeatableComponent = ({ field }: RepeatableRequirementProps) => {
		const dynamicField: Repeatable = {
			...field,
			instances: [],
		};

		const [instances, setInstances] = useState(dynamicField.instances);

		const addInstance = () => {
			const newInstance = field.content.map((element, index) => {
				const updateRequirementId = (el: RequirementElement, prefix: string): RequirementElement => {
					const updatedRequirement = {
						...el,
						id: `${prefix}-1-${index}`,
					};

					if (updatedRequirement.elementType === "optional" || updatedRequirement.elementType === "repeatable") {
						updatedRequirement.content = updatedRequirement.content.map((nestedEl) =>
							updateRequirementId(nestedEl, updatedRequirement.id)
						);
					}

					if (updatedRequirement.elementType === "choice") {
						updatedRequirement.options = updatedRequirement.options.map((option) => {
							if (typeof option !== "string" && option.elementType === "group") {
								return {
									...option,
									content: option.content.map((nestedEl) => updateRequirementId(nestedEl, updatedRequirement.id)),
								};
							}
							return option;
						});
					}

					return updatedRequirement;
				};

				return updateRequirementId(element, `${field.placeholder}-${instances.length}-${index}`);
			});

			const updatedInstances = [...instances, newInstance];
			setInstances(updatedInstances);
		};

		const removeInstance = (index: number) => {
			const updatedInstances = [...instances];
			updatedInstances.splice(index, 1);
			setInstances(updatedInstances);
		};

		return (
			<Box sx={styles.horizontal}>
				{instances.map((instance, index) => (
					<Box sx={styles.optionalField} key={index}>
						{instance.map((nestedField) => renderField(nestedField, index))}
						<Box onClick={() => removeInstance(index)} className="remove-button" sx={styles.removeButton}>
							<Icon icon="ph:x-bold" />
						</Box>
					</Box>
				))}
				{instances.length < field.maxInstances && (
					<Button
						variant="outlined"
						color="neutral"
						endDecorator={<Icon icon="ph:plus-bold" />}
						onClick={addInstance}
						sx={(styles.transition, { fontWeight: 400 })}
					>
						{field.placeholder}
					</Button>
				)}
			</Box>
		);
	};

	interface ReferenceRequirementProps {
		field: ReferenceRequirement;
	}

	const renderField = (field: RequirementElement, index: number) => {
		switch (field.elementType) {
			case "text":
				return <TextComponent key={`1-${index}`} field={field} />;
			case "input":
				return <InputComponent key={`1-${index}`} field={field} />;
			case "choice":
				return <ChoiceComponent key={`1-${index}`} field={field} />;
			case "optional":
				return <OptionalComponent key={`1-${index}`} field={field} />;
			case "repeatable":
				return <RepeatableComponent key={`1-${index}`} field={field} />;
			// case "reference":
			// 	return <ReferenceRequirement key={`1-${index}`} field={field} updateData={updateRequirementData} />;
			default:
				return null;
		}
	};

	return (
		<Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
			{content.map((field, index) => renderField(field, index))}
		</Box>
	);
};

export default RequirementFields;
