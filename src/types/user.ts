type User = {
	_id: string;
	name: string;
	role: "user" | "admin";
	createdAt: Date;
	requirements: string[];
};

export type { User };
