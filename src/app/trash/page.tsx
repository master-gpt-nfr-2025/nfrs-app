import { Card, Stack, Typography } from "@mui/joy";
import RequirementModel from "@/models/requirement.model";
import React from "react";
import connect from "@/config/db";
import TrashedItems from "@/components/ui/trashed-items";
import UserModel from "@/models/user.model";

export type TrashedItemType = {
	_id: string;
	id: string;
	name: string;
	createdAt: Date;
	createdBy: {
		_id: string;
		name: string;
	};
	trashedAt: Date;
	trashedBy: string;
};

const Trash = async () => {
	const fetchTrashedItems = async () => {
		"use server";
		await connect();
		await UserModel.findOne();
		const trashedRequirements = await RequirementModel.find({ trashed: true })
			.select("_id id name createdAt createdBy trashedAt trashedBy")
			.populate({
				path: "createdBy",
				select: "_id name",
			})
			.lean();

		return trashedRequirements;
	};

	const items = await fetchTrashedItems();

	const itemsJSON = JSON.parse(JSON.stringify(items));

	return (
		<Stack direction={"column"} gap={2}>
			<Typography level="h3">Kosz</Typography>
			<Typography level="body-md">Elementy widoczne poniżej są automatycznie usuwane trwale po 30 dniach od przeniesienia do kosza</Typography>
			<Stack gap={1} alignItems="flex-start" direction="row">
				<Card variant="plain">
					<TrashedItems items={itemsJSON as TrashedItemType[]} />
				</Card>
			</Stack>
		</Stack>
	);
};

export default Trash;
