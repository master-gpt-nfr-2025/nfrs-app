"use client";
import { Button } from "@mui/joy";
import React, { useState } from "react";
import { Requirement } from "@/types/requirement";
import UseTemplateModal from "./use-template-modal";
import { AddRounded } from "@mui/icons-material";

type UseTemplateButtonProps = {
	requirement: Requirement;
	setReqId: React.Dispatch<React.SetStateAction<string | null>>;
	setSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
};

const UseTemplateButton = ({ requirement, setReqId, setSnackbar }: UseTemplateButtonProps) => {
	const [openModal, setModalOpen] = useState<boolean>(false);
	const handleClick = () => {
		setModalOpen(true);
	};

	return (
		<>
			<Button color="primary" variant="soft" startDecorator={<AddRounded />} onClick={handleClick}>
				Zapisz wymaganie
			</Button>
			<UseTemplateModal open={openModal} setOpen={setModalOpen} requirement={requirement} setReqId={setReqId} setSnackbar={setSnackbar} />
		</>
	);
};

export default UseTemplateButton;
