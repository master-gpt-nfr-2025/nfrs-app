import { Typography } from "@mui/joy";
import { StyledTreeItem } from "./styled-tree-item";

type CategoryItemProps = {
	itemId: string;
	name: string;
	children?: React.ReactNode;
	sx?: Record<string, unknown>;
};

function CategoryItem({ itemId, name, children, sx }: CategoryItemProps) {
	return (
		<StyledTreeItem itemId={itemId} label={<Typography sx={sx}>{name}</Typography>}>
			{children}
		</StyledTreeItem>
	);
}

export { CategoryItem };
