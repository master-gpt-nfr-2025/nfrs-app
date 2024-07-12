import {
	Button,
	Chip,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	Modal,
	ModalClose,
	ModalDialog,
	Stack,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Requirement } from "@/types/requirement";
import { saveRequirement } from "@/lib/actions-requirement";
import { generateRequirementId } from "@/lib/mapping";

type UseTemplateModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	requirement: Requirement;
};

const UseTemplateModal = ({ open, setOpen, requirement }: UseTemplateModalProps) => {
	const [reqID, setReqID] = useState<string>(requirement?.id);
	const [name, setName] = useState<string>("");

	const [error, setError] = useState<boolean>(false);
	const [errorText, setErrorText] = useState<string>("");

	const handleCloseModal = (e: any, reason: string) => {
		if (reason === "backdropClick") {
			return;
		}
		setOpen(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
		setErrorText("");
		setError(false);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!name) {
			setError(true);
			setErrorText("Nazwa wymagania jest obowiązkowa!");
			return;
		}
		requirement.name = name;
		const nameFree = await saveRequirement(requirement);
		if (!nameFree) {
			setError(true);
			setErrorText("Wymaganie o podanej nazwie już istnieje!");
			return;
		}

		setOpen(false);
	};

	useEffect(() => {
		const getNewID = async () => {
			const newID = await generateRequirementId();
			setReqID(newID);
			requirement.id = newID;
		};

		if (open) {
			getNewID();
		}
	}, [open]);

	return (
		<>
			<Modal open={open} onClose={handleCloseModal}>
				<ModalDialog size="lg">
					<ModalClose variant="plain" color="danger" />
					<DialogTitle component="div">
						Utwórz nowe wymaganie
						<Chip color="primary">{reqID}</Chip>
					</DialogTitle>
					<DialogContent>Uzupełnij brakujące informacje aby utworzyć nowe wymaganie</DialogContent>

					<form onSubmit={handleSubmit}>
						<FormControl error={error}>
							<FormLabel sx={{ fontWeight: "600" }} htmlFor="requirement-name">
								Nazwa wymagania
							</FormLabel>
							<Input placeholder="Nazwa wymagania" variant="soft" value={name} onChange={handleChange} />
							<FormHelperText>{errorText}</FormHelperText>
							<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
								<Button variant="solid" color="primary" type="submit">
									Utwórz
								</Button>
								<Button variant="outlined" color="primary" onClick={() => setOpen(false)}>
									Anuluj
								</Button>
							</Stack>
						</FormControl>
					</form>
				</ModalDialog>
			</Modal>
			{/* <ConfirmSnackbar snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} setOpen={setOpen} /> */}
		</>
	);
};

export default UseTemplateModal;
