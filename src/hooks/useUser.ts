import { useState, useEffect } from "react";
import Cookies from "js-cookie";

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
			Cookies.set("userId", storedUserId, { expires: 7 });
		}
	}, []);

	const setUserStorage = (id: string, name: string) => {
		localStorage.setItem("userId", id);
		localStorage.setItem("userName", name);
		Cookies.set("userId", id, { expires: 7 });
		setUser({
			id: id,
			name: name,
		});
	};

	const logout = () => {
		// Clear localStorage
		localStorage.removeItem("userId");
		localStorage.removeItem("userName");
		sessionStorage.removeItem("popupShown");

		// Clear cookies
		Cookies.remove("userId");

		// Reset user state
		setUser(null);
	};

	return { user, setUserStorage, logout };
}
