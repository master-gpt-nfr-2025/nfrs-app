"use client";
import styles from "@/styles/template-form";
import {
	ChoiceRequirement,
	ChoiceRequirementOption,
	InputRequirement,
	OptionalRequirement,
	ReferenceRequirement,
	RepeatableRequirement,
	Requirement,
	RequirementElement,
	TextRequirement,
} from "@/types/requirement";
import { Box, Input, Select, Typography, Option, Button, Chip } from "@mui/joy";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";

type RequirementFieldsProps = {
	requirement: Requirement;
};

const RequirementFields = ({ requirement }: RequirementFieldsProps) => {
	const updateData = () => {};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Submit");
	};

	const updateRequirementContent = (
		content: RequirementElement[],
		fieldId: string,
		updatedData: Partial<RequirementElement>
	): RequirementElement[] => {
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

	// ============== SUBCOMPONENTS ==============

	interface FieldProps {
		updateData: (updatedData: Partial<RequirementElement>) => void;
	}

	interface TextElementProps {
		field: TextRequirement;
	}

	interface InputElementProps extends FieldProps {
		field: InputRequirement;
	}

	interface ChoiceElementProps extends FieldProps {
		field: ChoiceRequirement;
	}

	interface OptionalElementProps extends FieldProps {
		field: OptionalRequirement;
	}

	interface RepeatableElementProps extends FieldProps {
		field: RepeatableRequirement;
	}

	interface ReferenceElementProps extends FieldProps {
		field: ReferenceRequirement;
	}

	const TextElement = ({ field }: TextElementProps) => {
		return <Typography sx={{ zIndex: 1 }}>{field.value}</Typography>;
	};

	const InputElement = ({ field, updateData }: InputElementProps) => {
		const [value, setValue] = useState(field.value);

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setValue(e.target.value);
		};

		const maxWidth = () => {
			if (field.inputType === "number") {
				return 100;
			} else {
				``;
				return "auto";
			}
		};

		return (
			<Input
				sx={(styles.transition, { maxWidth: maxWidth() })}
				type={field.inputType}
				placeholder={field.placeholder}
				value={value}
				onChange={handleInputChange}
			/>
		);
	};

	const ChoiceElement = ({ field, updateData }: ChoiceElementProps) => {
		const [selected, setSelected] = useState(field.selectedOption);

		const handleChoiceChange = (event: React.SyntheticEvent | null, newValue: string | null) => {
			setSelected(newValue!);
		};

		const renderSelectedOption = (options: (ChoiceRequirementOption | string)[]) => {
			return options.map((option) => {
				if (typeof option === "string") {
					return null;
				} else if (option.value === selected) {
					return (
						<Box key={option.id} sx={styles.horizontal}>
							{option.content.map((content) => renderField(content))}
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
					sx={{ width: maxLength() * 18, ...styles.transition, zIndex: 1 }}
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

	const OptionalElement = ({ field, updateData }: OptionalElementProps) => {
		const [enabled, setEnabled] = useState(field.enabled);

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
						{field.content.map((nestedField) => renderField(nestedField))}
						<Box onClick={handleDisable} className="remove-button" sx={styles.removeButton}>
							<Icon icon="ph:x-bold" />
						</Box>
					</Box>
				);
			}
		};

		return renderContent();
	};

	const RepeatableElement = ({ field, updateData }: RepeatableElementProps) => {
		const [instances, setInstances] = useState(field.instances);

		const addInstance = () => {
			const newInstance = field.content.map((element, index) => {
				const updateElementId = (el: RequirementElement, prefix: string): RequirementElement => {
					const updatedElement: RequirementElement = {
						...el,
						id: `${prefix}-${el.id}`,
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

				return updateElementId(element, `${field.id}-${instances.length}-${index}`);
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
						{instance.map((nestedField) => renderField(nestedField))}
						<Box onClick={() => removeInstance(index)} className="remove-button" sx={styles.removeButton}>
							<Icon icon="ph:x-bold" />
						</Box>
					</Box>
				))}
				{instances.length < field.maxInstances && (
					<Button variant="outlined" color="neutral" endDecorator={<Icon icon="ph:plus-bold" />} onClick={addInstance}>
						{field.placeholder}
					</Button>
				)}
			</Box>
		);
	};

	const ReferenceElement = ({ field }: ReferenceElementProps) => {
		// Implementacja dla pola referencyjnego
		return null;
	};

	// ============== RENDER FIELDS ==============

	const renderField = (field: RequirementElement, index?: number) => {
		switch (field.elementType) {
			case "text":
				return <TextElement key={field.id} field={field} />;
			case "input":
				return <InputElement key={field.id} field={field} updateData={updateData} />;
			case "choice":
				return <ChoiceElement key={field.id} field={field} updateData={updateData} />;
			case "optional":
				return <OptionalElement key={field.id} field={field} updateData={updateData} />;
			case "repeatable":
				return <RepeatableElement key={field.id} field={field} updateData={updateData} />;
			case "reference":
				return <ReferenceElement key={field.id} field={field} updateData={updateData} />;
			default:
				return null;
		}
	};

	// ============== RETURN ==============

	return (
		<form onSubmit={handleSubmit}>
			<Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "flex-start" }}>
				{/* <ParsedTextDisplay /> */}
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
					{requirement.content.map((field) => renderField(field))}
				</Box>
				{/* <Button sx={{ maxWidth: 100 }} type="submit">
					Submit
				</Button>{" "} */}
			</Box>
		</form>
	);
};

export default RequirementFields;
