"use client";
import styles from "@/styles/template-form";
import {
	ChoiceElement,
	ChoiceElementOption,
	InputElement,
	OptionalElement,
	ReferenceElement,
	RepeatableElement,
	TemplateElement,
	TextElement,
} from "@/types/template";
import { Box, Input, Select, Typography, Option, Button } from "@mui/joy";
import React, { useState } from "react";
import { AddRounded, Close, CloseRounded } from "@mui/icons-material";

type TemplateFieldsProps = {
	content: TemplateElement[];
};

interface TextElementProps {
	field: TextElement;
}

const TextComponent = ({ field }: TextElementProps) => {
	return <Typography sx={{ zIndex: 1 }}>{field.value}</Typography>;
};

interface InputElementProps {
	field: InputElement;
}

const InputComponent = ({ field }: InputElementProps) => {
	const maxWidth = () => {
		if (field.inputType === "number") {
			return 100;
		} else {
			return "auto";
		}
	};

	return (
		<Input
			variant="soft"
			color="primary"
			sx={(styles.transition, { maxWidth: maxWidth() })}
			type={field.inputType}
			placeholder={field.placeholder}
		/>
	);
};

interface ChoiceElementProps {
	field: ChoiceElement;
}

const ChoiceComponent = ({ field }: ChoiceElementProps) => {
	const dynamicField = {
		...field,
		selectedOption: "",
	};

	const [selected, setSelected] = useState(dynamicField.selectedOption);

	const handleChoiceChange = (event: React.SyntheticEvent | null, newValue: string | null) => {
		setSelected(newValue!);
	};

	const renderSelectedOption = (options: (ChoiceElementOption | string)[]) => {
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
				variant="soft"
				color="primary"
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

interface OptionalElementProps {
	field: OptionalElement;
}

const OptionalComponent = ({ field }: OptionalElementProps) => {
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
					variant="soft"
					color="primary"
					endDecorator={<AddRounded />}
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
						<CloseRounded />
					</Box>
				</Box>
			);
		}
	};

	return renderContent();
};

interface RepeatableElementProps {
	field: RepeatableElement;
}

type Repeatable = {
	instances: TemplateElement[][];
};

const RepeatableComponent = ({ field }: RepeatableElementProps) => {
	const dynamicField: Repeatable = {
		...field,
		instances: [],
	};

	const [instances, setInstances] = useState(dynamicField.instances);

	const addInstance = () => {
		const newInstance = field.content.map((element, index) => {
			const updateElementId = (el: TemplateElement, prefix: string): TemplateElement => {
				const updatedElement = {
					...el,
					id: `${prefix}-1-${index}`,
				};

				if (updatedElement.elementType === "optional" || updatedElement.elementType === "repeatable") {
					updatedElement.content = updatedElement.content.map((nestedEl) => updateElementId(nestedEl, updatedElement.id));
				}

				if (updatedElement.elementType === "choice") {
					updatedElement.options = updatedElement.options.map((option) => {
						if (typeof option !== "string" && option.elementType === "group") {
							return {
								...option,
								content: option.content.map((nestedEl) => updateElementId(nestedEl, updatedElement.id)),
							};
						}
						return option;
					});
				}

				return updatedElement;
			};

			return updateElementId(element, `${field.placeholder}-${instances.length}-${index}`);
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
						<CloseRounded />
					</Box>
				</Box>
			))}
			{instances.length < field.maxInstances && (
				<Button
					variant="soft"
					color="primary"
					endDecorator={<AddRounded />}
					onClick={addInstance}
					sx={(styles.transition, { fontWeight: 400 })}
				>
					{field.placeholder}
				</Button>
			)}
		</Box>
	);
};

interface ReferenceElementProps {
	field: ReferenceElement;
}

const renderField = (field: TemplateElement, index: number) => {
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
		// 	return <ReferenceElement key={`1-${index}`} field={field} updateData={updateRequirementData} />;
		default:
			return null;
	}
};

const TemplateFields = ({ content }: TemplateFieldsProps) => {
	return (
		<Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
			{content.map((field, index) => renderField(field, index))}
		</Box>
	);
};

export default TemplateFields;
