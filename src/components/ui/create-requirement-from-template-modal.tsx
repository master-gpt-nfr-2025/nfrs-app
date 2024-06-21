"use client";
import {
	Box,
	Button,
	DialogContent,
	DialogTitle,
	Modal,
	ModalClose,
	ModalDialog,
	Snackbar,
	Stack,
	Typography,
	Chip,
	Divider,
	FormControl,
	Input,
	FormLabel,
	Alert,
} from "@mui/joy";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Template } from "@/types/template";
import { mapTemplate } from "@/lib/mapping";
import {
	ChoiceRequirement,
	InputRequirement,
	OptionalRequirement,
	ReferenceRequirement,
	RepeatableRequirement,
	Requirement,
	RequirementElement,
} from "@/types/requirement";
import RequirementFields from "./requirement-fields";
import ConfirmSnackbar from "./confirm-snackbar";
import { updateRequirementContent } from "@/lib/utils";
import ParsedRequirementText from "./parsed-requiremrnt-text";

type CreateRequirementFromTemplateModalProps = {
	template: Template;
	open: boolean;
	setOpen: (open: boolean) => void;
};

const CreateRequirementFromTemplateModal = ({ template, open, setOpen }: CreateRequirementFromTemplateModalProps) => {
	const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
	const [requirement, setRequirement] = useState<Requirement>();
	// const [requirementData, setRequirementData] = useState<Requirement>();
	// const memoizedRequirement = useMemo(() => requirement, [requirement]);
	const [dirty, setDirty] = useState(false);
	const [name, setName] = useState<string>("");

	// const requirementRef = useRef(memoizedRequirement);

	useEffect(() => {
		if (open) {
			console.log("Template ID: ", template.id);
		}
		const getRequirement = async () => {
			const requirement = await mapTemplate(template);
			setRequirement(requirement);
			// setRequirementData(requirement);
		};
		getRequirement();
	}, [template]);

	const handleCloseModal = (e: any, reason: string) => {
		if (reason === "backdropClick") {
			return;
		}
		if (dirty) {
			setSnackbarOpen(true);
		} else {
			setOpen(false);
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!requirement) {
			console.error("Requirement is undefined");
			return;
		}
		// console.log(requirementRef);
		// setParsedText(parsedTextRef.current);
		// console.log(requirementRef.current);
		// console.log(updatedRequirement);
	};
	// const updateRequirementData = useCallback((updatedData: Partial<Requirement>) => {
	// 	if (requirementRef.current) {
	// 		requirementRef.current = { ...requirementRef.current, ...updatedData };
	// 	}
	// 	// updateParsedText();
	// }, []);

	// const updateRequirementContent = (
	// 	content: RequirementElement[],
	// 	fieldId: string,
	// 	updatedData: Partial<RequirementElement>
	// ): RequirementElement[] => {
	// 	const dfs = (elements: RequirementElement[]): RequirementElement[] => {
	// 		return elements.map((field) => {
	// 			if (field.id === fieldId) {
	// 				switch (field.elementType) {
	// 					case "input":
	// 						return { ...field, ...(updatedData as Partial<InputRequirement>) };
	// 					case "choice":
	// 						return { ...field, ...(updatedData as Partial<ChoiceRequirement>) };
	// 					case "optional":
	// 						return {
	// 							...field,
	// 							content: dfs(field.content),
	// 							...(updatedData as Partial<OptionalRequirement>),
	// 						};
	// 					case "repeatable":
	// 						return {
	// 							...field,
	// 							instances: field.instances.map((instance) => dfs(instance)),
	// 							...(updatedData as Partial<RepeatableRequirement>),
	// 						};
	// 					case "reference":
	// 						return { ...field, ...(updatedData as Partial<ReferenceRequirement>) };
	// 					default:
	// 						return field;
	// 				}
	// 			}
	// 			if (field.elementType === "optional") {
	// 				return {
	// 					...field,
	// 					content: dfs(field.content),
	// 				};
	// 			}
	// 			if (field.elementType === "repeatable") {
	// 				return {
	// 					...field,
	// 					instances: field.instances.map((instance) => dfs(instance)),
	// 				};
	// 			}
	// 			if (field.elementType === "choice") {
	// 				return {
	// 					...field,
	// 					options: field.options.map((option) => {
	// 						if (typeof option !== "string" && option.elementType === "group") {
	// 							return {
	// 								...option,
	// 								content: dfs(option.content),
	// 							};
	// 						}
	// 						return option;
	// 					}),
	// 				};
	// 			}
	// 			return field;
	// 		});
	// 	};

	// 	return dfs(content);
	// };

	// const updateRequirementData = (updatedData: Partial<RequirementElement>) => {
	// 	if (requirement) {
	// 		setRequirement((prevRequirement) => {
	// 			if (!prevRequirement) {
	// 				console.error("prevRequirement is undefined");
	// 				return;
	// 			}
	// 			return {
	// 				...prevRequirement,
	// 				content: updateRequirementContent(prevRequirement.content, updatedData),
	// 			};
	// 		});
	// 	} else {
	// 		console.error("RequirementRef is undefined");
	// 	}
	// };

	return (
		<>
			<Modal open={open} onClose={handleCloseModal}>
				<ModalDialog size="lg">
					<ModalClose variant="plain" color="danger" />
					<DialogTitle component="div">
						Utwórz nowe wymaganie
						{requirement && <Chip color="primary">{requirement?.id}</Chip>}
					</DialogTitle>
					<DialogContent>Wypełnij odpowiednie pola w szablonie aby utworzyć nowe wymaganie</DialogContent>

					<Stack direction="row" spacing={1}>
						<Chip color="neutral" variant="soft">
							Pola opcjonalne
						</Chip>
						<Chip color="neutral" variant="outlined">
							Pola obowiązkowe
						</Chip>
					</Stack>

					{/* <ParsedRequirementText requirement={requirement} /> */}

					{requirement !== undefined && <RequirementFields requirement={requirement} />}

					<Divider inset="none" sx={{ my: "0.5rem" }} />
					<form onSubmit={handleSubmit}>
						<FormControl>
							<FormLabel sx={{ fontWeight: "600" }} htmlFor="requirement-name">
								Nazwa
							</FormLabel>
							<Input
								placeholder="Nazwa wymagania"
								variant="soft"
								sx={{ marginBottom: 2 }}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>

							<Stack direction="row" spacing={1}>
								<Button variant="solid" color="primary" type="submit">
									Utwórz
								</Button>
								<Button variant="outlined" color="primary" onClick={() => setSnackbarOpen(true)}>
									Anuluj
								</Button>
							</Stack>
						</FormControl>
					</form>
				</ModalDialog>
			</Modal>
			<ConfirmSnackbar snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} setOpen={setOpen} />
		</>
	);
};

export default CreateRequirementFromTemplateModal;
