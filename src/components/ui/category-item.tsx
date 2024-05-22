import { Typography } from "@mui/joy";
import { StyledTreeItem } from "./styled-tree-item";

type CategoryItemProps = {
	itemId: string;
	name: string;
	children?: React.ReactNode;
};

function CategoryItem({ itemId, name, children }: CategoryItemProps) {
	return (
		<StyledTreeItem itemId={itemId} label={<Typography>{name}</Typography>}>
			{children}
		</StyledTreeItem>
	);
}

export { CategoryItem };
