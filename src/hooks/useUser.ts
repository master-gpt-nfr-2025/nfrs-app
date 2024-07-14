import { useState, useEffect } from "react";

type User = {
	id: string;
	name: string;
};

export function useUser() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const storedUserId = localStorage.getItem("userId");
		const storedUserName = localStorage.getItem("userName");
		if (storedUserId && storedUserName) {
			setUser({
				id: storedUserId,
				name: storedUserName,
			});
		}
	}, []);

	const setUserStorage = (id: string, name: string) => {
		localStorage.setItem("userId", id);
		localStorage.setItem("userName", name);
		setUser({
			id: id,
			name: name,
		});
	};

	return { user, setUserStorage };
}
