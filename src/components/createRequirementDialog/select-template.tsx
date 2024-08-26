import React from "react";
import { Typography, Sheet, Stack, Divider, Button } from "@mui/joy";
import DialogNavigationButtons from "../ui/dialog-navigation-buttons";
import { useCreateRequirementFormContext } from "@/context/createRequirementDialogContext";
import { AddRounded } from "@mui/icons-material";

type TemplateRow = {
	_id: string;
	id: string;
	name: string;
	description: string;
	custom?: boolean;
};

type SelectTemplateType = {
	templates: TemplateRow[];
	selectedTemplate: string | null;
	onTemplateSelect: (templateId: string | null) => void;
	loading: boolean;
};

type TableRowProps = {
	header?: boolean;
	content: TemplateRow;
	selected: boolean;
	onClick?: () => void;
	onDoubleClick?: () => void;
};

const TableRow = ({ header, content, selected, onClick, onDoubleClick }: TableRowProps) => {
	return header ? (
		<Sheet variant="soft" color="neutral" sx={{ px: "1rem", py: "0.5rem" }}>
			<Stack direction={"row"}>
				<Typography fontWeight={600} sx={{ flex: 2 }}>
					{content.id}
				</Typography>
				<Typography fontWeight={600} sx={{ flex: 3 }}>
					{content.name}
				</Typography>
				<Typography fontWeight={600} sx={{ flex: 7 }}>
					{content.description}
				</Typography>
			</Stack>
		</Sheet>
	) : (
		<Sheet
			variant={selected ? "solid" : "plain"}
			color={selected ? "primary" : "neutral"}
			sx={{ px: "1rem", py: "0.5rem", cursor: "pointer" }}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
		>
			<Stack direction={"row"}>
				<Typography sx={{ flex: 2, color: "inherit" }}>{content.id}</Typography>
				<Typography sx={{ flex: 3, color: "inherit" }}>{content.name}</Typography>
				<Typography sx={{ flex: 7, color: "inherit" }}>{content.description ? content.description : "Brak dostępnego opisu."}</Typography>
			</Stack>
		</Sheet>
	);
};

const SelectTemplate = ({ templates, onTemplateSelect, selectedTemplate, loading }: SelectTemplateType) => {
	const { next } = useCreateRequirementFormContext();

	const handleTemplateSelect = (templateId: string) => {
		const newSelectedTemplate = selectedTemplate === templateId ? null : templateId;
		onTemplateSelect(newSelectedTemplate);
	};

	const handleCustomTemplate = () => {
		onTemplateSelect(templates[0]._id);
		next();
	};

	const customTemplate = templates.length === 1 && templates[0].custom;

	return (
		<>
			{customTemplate ? (
				<Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
					<Typography level="body-lg">Brak szablonów dla tej podkategorii. Możesz jednak dodać swoje własne wymaganie</Typography>
					<Button variant="solid" onClick={handleCustomTemplate}>
						<AddRounded />
						Dodaj
					</Button>
				</Stack>
			) : (
				<>
					<Typography level="h4" mb={2}>
						Wybierz szablon
					</Typography>
					<Stack sx={{ width: "100%", minWidth: 800 }}>
						<TableRow header content={{ _id: "", id: "ID", name: "Nazwa szablonu", description: "Opis szablonu" }} selected={false} />
						<Divider />
						{templates.map((template) => (
							<TableRow
								key={template._id}
								content={template}
								selected={selectedTemplate === template._id}
								onClick={() => handleTemplateSelect(template._id)}
							/>
						))}
					</Stack>
				</>
			)}
			<DialogNavigationButtons nextActive={!!selectedTemplate} nextVisible={!customTemplate} />
		</>
	);
};

export default SelectTemplate;
