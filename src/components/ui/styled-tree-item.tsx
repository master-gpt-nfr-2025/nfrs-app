import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";

import { alpha, styled } from "@mui/material/styles";

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
	color: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[200],

	[`& .${treeItemClasses.content}`]: {
		borderRadius: theme.spacing(0.5),
		padding: theme.spacing(0.5, 1),
		margin: theme.spacing(0.2, 0),
		[`& .${treeItemClasses.label}`]: {
			fontSize: "0.8rem",
			fontWeight: 500,
		},
	},
	[`& .${treeItemClasses.iconContainer}`]: {
		borderRadius: "50%",
		// backgroundColor: theme.palette.mode === "light" ? alpha(theme.palette.primary.main, 0.25) : theme.palette.primary.dark,
		color: theme.palette.mode === "dark" && theme.palette.primary.contrastText,
		padding: theme.spacing(0.2, 1.2),
		"& .empty": {
			opacity: 0.4,
		},
	},
}));

export { StyledTreeItem };
