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
} from "@mui/joy";
import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Template } from "@/types/template";
import { mapTemplate } from "@/lib/mapping";
import { Requirement } from "@/types/requirement";
import RequirementFields from "./requirement-fields";
import ConfirmSnackbar from "./confirm-snackbar";

type CreateRequirementFromTemplateModalProps = {
	template: Template;
	open: boolean;
	setOpen: (open: boolean) => void;
};

const CreateRequirementFromTemplateModal = ({ template, open, setOpen }: CreateRequirementFromTemplateModalProps) => {
	const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
	const [requirement, setRequirement] = useState<Requirement>();
	const [dirty, setDirty] = useState(false);
	const [name, setName] = useState<string>("");

	useEffect(() => {
		if (open) {
			console.log("Template ID: ", template.id);
		}
		const getRequirement = async () => {
			const requirement = await mapTemplate(template);
			setRequirement(requirement);
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
		console.log("Form submitted: " + "name: " + name + " requirement: ");
		console.log(requirement);
	};

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

					<RequirementFields content={requirement?.content || []} dirty={dirty} setDirty={setDirty} name="d" />

					<Divider inset="none" sx={{ my: "1rem" }} />
					<form onSubmit={handleSubmit}>
						<FormControl>
							<FormLabel sx={{ fontWeight: "600" }} htmlFor="requirement-name">
								Nazwa
							</FormLabel>
							<Input placeholder="Nazwa wymagania" variant="soft" sx={{ marginBottom: 2 }} onChange={(e) => setName(e.target.value)} />

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
