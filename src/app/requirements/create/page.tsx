"use client";
import { DialogContent, DialogTitle, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import React from "react";

const CreateRequirementModal = () => {
	const router = useRouter();

	const handleClose = () => {
		router.back();
	};

	return (
		<Modal open onClose={handleClose} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
			<ModalDialog>
				<DialogTitle>Create new project</DialogTitle>
				<ModalClose />
				<DialogContent>Fill in the information of the project.</DialogContent>
				<Typography>Treść</Typography>
			</ModalDialog>
		</Modal>
	);
};

export default CreateRequirementModal;
