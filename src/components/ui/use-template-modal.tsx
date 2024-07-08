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
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import ConfirmSnackbar from "./confirm-snackbar";
import { Requirement } from "@/types/requirement";

type UseTemplateModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	requirement: Requirement;
};

const UseTemplateModal = ({ open, setOpen, requirement }: UseTemplateModalProps) => {
	const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
	const [name, setName] = useState<string>("");

	const [error, setError] = useState<boolean>(false);
	const [errorText, setErrorText] = useState<string>("");

	const handleCloseModal = (e: any, reason: string) => {
		if (reason === "backdropClick") {
			return;
		}
		setSnackbarOpen(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
		setErrorText("");
		setError(false);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!name) {
			setError(true);
			setErrorText("Nazwa wymagania jest obowiązkowa!");
			return;
		}
		requirement.name = name;
		console.log("Submitted: ", requirement);
	};

	return (
		<>
			<Modal open={open} onClose={handleCloseModal}>
				<ModalDialog size="lg">
					<ModalClose variant="plain" color="danger" />
					<DialogTitle component="div">
						Utwórz nowe wymaganie
						<Chip color="primary">{requirement?.id}</Chip>
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

export default UseTemplateModal;
