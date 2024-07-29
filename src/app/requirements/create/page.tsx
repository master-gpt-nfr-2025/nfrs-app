"use client";
import FillTemplate from "@/components/createRequirementDialog/fill-template";
import SelectCategory from "@/components/createRequirementDialog/select-category";
import SelectTemplate from "@/components/createRequirementDialog/select-template";
import { CreateRequirementFormDialog } from "@/context/createRequirementDialogContext";
import { fetchCategories } from "@/lib/actions-categories";
import { DialogTitle, Modal, ModalClose, ModalDialog, ModalOverflow } from "@mui/joy";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export type CategoryType = {
	_id: string;
	categoryName: string;
	subcategories: {
		_id: string;
		subcategoryName: string;
		subcategoryId: string;
		subcategoryDescription: string;
	}[];
};

const CreateRequirementModal = () => {
	const router = useRouter();

	const handleClose = () => {
		router.back();
	};

	const [categories, setCategories] = useState<CategoryType[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchCategories();
			setCategories(data);
		};

		fetchData();
	}, []);

	const steps = [
		<SelectCategory key={Math.random() * 100 + "st"} categories={categories} />,
		<SelectTemplate key={Math.random() * 100 + "nd"} />,
		<FillTemplate key={Math.random() * 100 + "rd"} />,
	];

	return (
		<Modal open onClose={handleClose} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
			<ModalOverflow>
				<ModalDialog size="lg">
					<DialogTitle>Utwórz nowe wymaganie</DialogTitle>
					<ModalClose />
					<CreateRequirementFormDialog>{steps}</CreateRequirementFormDialog>
				</ModalDialog>
			</ModalOverflow>
		</Modal>
	);
};

export default CreateRequirementModal;
