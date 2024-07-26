"use client";
import FillTemplate from "@/components/createRequirementDialog/fill-template";
import SelectCategory from "@/components/createRequirementDialog/select-category";
import SelectTemplate from "@/components/createRequirementDialog/select-template";
import { CreateRequirementFormDialog } from "@/context/createRequirementDialogContext";
import { DialogTitle, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { useRouter } from "next/navigation";
import React from "react";

const CreateRequirementModal = () => {
	const router = useRouter();

	const handleClose = () => {
		router.back();
	};

	const steps = [
		<SelectCategory key={Math.random() * 100 + "st"} />,
		<SelectTemplate key={Math.random() * 100 + "nd"} />,
		<FillTemplate key={Math.random() * 100 + "rd"} />,
	];

	return (
		<Modal open onClose={handleClose} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
			<ModalDialog>
				<DialogTitle>Utwórz nowe wymaganie</DialogTitle>
				<ModalClose />
				<CreateRequirementFormDialog>{steps}</CreateRequirementFormDialog>
			</ModalDialog>
		</Modal>
	);
};

export default CreateRequirementModal;
