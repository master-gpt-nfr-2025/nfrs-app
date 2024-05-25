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

type CreateRequirementFromTemplateModalProps = {
	template: Template;
	open: boolean;
	setOpen: (open: boolean) => void;
};

const CreateRequirementFromTemplateModal = ({ template, open, setOpen }: CreateRequirementFromTemplateModalProps) => {
	const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
	const [requirement, setRequirement] = useState<Requirement>();

	useEffect(() => {
		if (open) {
			console.log("Template ID: ", template.id);
		}
		const getRequirement = async () => {
			const requirement = await mapTemplate(template);
			console.log("Requirement: ", requirement);
			setRequirement(requirement);
		};
		getRequirement();
	}, [template]);

	return (
		<>
			<Modal
				open={open}
				onClose={(e, reason) => {
					if (reason === "backdropClick") {
						return;
					}
					setSnackbarOpen(true);
				}}
			>
				<ModalDialog size="lg">
					<ModalClose variant="plain" color="danger" />
					<DialogTitle>
						Utwórz nowe wymaganie
						{requirement && <Chip color="primary">{requirement?.id}</Chip>}
					</DialogTitle>
					<DialogContent>Wypełnij odpowiednie pola w szablonie aby utworzyć nowe wymaganie</DialogContent>
					<Divider inset="none" sx={{ my: "1rem" }} />
					<FormControl>
						<FormLabel sx={{ fontWeight: "600" }} htmlFor="requirement-name">
							Nazwa
						</FormLabel>
						<Input placeholder="Nazwa wymagania" variant="soft" sx={{ marginBottom: 2 }} />

						<Stack direction="row" spacing={1}>
							<Button variant="solid" color="primary">
								Utwórz
							</Button>
							<Button variant="outlined" color="primary" onClick={() => setSnackbarOpen(true)}>
								Anuluj
							</Button>
						</Stack>
					</FormControl>
				</ModalDialog>
			</Modal>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				sx={{ maxWidth: 360, display: "flex", alignItems: "flex-start" }}
				open={snackbarOpen}
				variant="soft"
				color="warning"
				startDecorator={<Icon icon="ph:warning-circle-fill" width={24} />}
				onClose={() => {
					setSnackbarOpen(false);
				}}
			>
				<div>
					<Typography level="title-lg" sx={{ fontWeight: 600 }}>
						Chwilka, na pewno?
					</Typography>
					<Typography sx={{ mt: 1, mb: 2 }}>Wprowadzone zmiany zostaną utracone</Typography>

					<Stack direction="row" spacing={1}>
						<Button
							variant="solid"
							color="warning"
							onClick={() => {
								setOpen(false);
								setSnackbarOpen(false);
							}}
						>
							Tak, na pewno
						</Button>
						<Button variant="outlined" color="warning" onClick={() => setSnackbarOpen(false)}>
							Nie, zostaję
						</Button>
					</Stack>
				</div>
			</Snackbar>
		</>
	);
};

export default CreateRequirementFromTemplateModal;
