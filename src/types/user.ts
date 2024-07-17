type User = {
	_id: string;
	name: string;
	role: "user" | "admin";
	createdAt: Date;
};

export type { User };
