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
import { Box, Input, Select, Typography, Option, Button } from "@mui/joy";
import React, { useCallback, useRef, useState } from "react";
import { Icon } from "@iconify/react";

type RequirementFieldsProps = {
	requirement: Requirement;
	updateRequirement: (fieldId: string, updatedData: Partial<RequirementElement>) => void;
};

const RequirementFields = React.memo(({ requirement, updateRequirement }: RequirementFieldsProps) => {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Submitted: ", requirement);
	};

	// ============== SUBCOMPONENTS ==============

	interface FieldProps {
		updateData: (fieldId: string, updatedData: Partial<RequirementElement>) => void;
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

	const InputElement = React.memo(({ field, updateData }: InputElementProps) => {
		const inputRef = useRef<HTMLInputElement>(null);

		const handleInputChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const newValue = e.target.value;
				updateData(field.id, { value: newValue });
			},
			[field.id, updateData]
		);

		const maxWidth = () => {
			if (field.inputType === "number") {
				return 100;
			} else {
				return "auto";
			}
		};

		return (
			<Input
				sx={(styles.transition, { maxWidth: maxWidth() })}
				ref={inputRef}
				type={field.inputType}
				placeholder={field.placeholder}
				defaultValue={field.value}
				onChange={handleInputChange}
			/>
		);
	});

	const ChoiceElement = ({ field, updateData }: ChoiceElementProps) => {
		const [selected, setSelected] = useState(field.selectedOption);

		const handleChoiceChange = useCallback(
			(event: React.SyntheticEvent | null, newValue: string | null) => {
				setSelected(newValue!);
				updateData(field.id, { selectedOption: newValue! });
			},
			[field.id, updateData]
		);

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
					sx={{ width: maxLength() * 10 + 40, ...styles.transition, zIndex: 1 }}
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
			updateData(field.id, { enabled: true });
		};

		const handleDisable = () => {
			setEnabled(false);
			updateData(field.id, { enabled: false });
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

	const RepeatableElement = React.memo(({ field, updateData }: RepeatableElementProps) => {
		const [instances, setInstances] = useState(field.instances);
		console.log(instances);

		const addInstance = useCallback(() => {
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
			updateData(field.id, { instances: updatedInstances });
		}, [field.id, field.content, instances, updateData]);

		const removeInstance = useCallback(
			(index: number) => {
				const updatedInstances = [...instances];
				updatedInstances.splice(index, 1);
				setInstances(updatedInstances);
				updateData(field.id, { instances: updatedInstances });
			},
			[instances, field.id, updateData]
		);

		return (
			<Box sx={styles.horizontal}>
				{instances.map((instance, index) => (
					<Box sx={styles.optionalField} key={`${field.id}-${index}`}>
						{instance.map((nestedField) => renderField(nestedField, `${field.id}-${index}`))}
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
	});

	const ReferenceElement = ({ field }: ReferenceElementProps) => {
		// Implementacja dla pola referencyjnego
		return null;
	};

	// ============== RENDER FIELDS ==============

	const renderField = useCallback(
		(field: RequirementElement, parentId: string = "") => {
			switch (field.elementType) {
				case "text":
					return <TextElement key={field.id} field={field} />;
				case "input":
					return <InputElement key={field.id} field={field} updateData={updateRequirement} />;
				case "choice":
					return <ChoiceElement key={field.id} field={field} updateData={updateRequirement} />;
				case "optional":
					return <OptionalElement key={field.id} field={field} updateData={updateRequirement} />;
				case "repeatable":
					return <RepeatableElement key={field.id} field={field} updateData={updateRequirement} />;
				case "reference":
					return <ReferenceElement key={field.id} field={field} updateData={updateRequirement} />;
				default:
					return null;
			}
		},
		[updateRequirement]
	);

	// ============== RETURN ==============

	return (
		<form onSubmit={handleSubmit}>
			<Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "flex-start" }}>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
					{React.useMemo(() => requirement.content.map((field, index) => renderField(field)), [requirement.content, renderField])}
				</Box>
				<Button type="submit" color="primary">
					Zapisz
				</Button>
			</Box>
		</form>
	);
});

export default RequirementFields;
