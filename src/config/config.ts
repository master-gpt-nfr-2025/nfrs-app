const CONFIG = {
	MONGO: {
		connectionString: `mongodb+srv://${process.env.DB_login}:${process.env.DB_password}@${process.env.DB_host}/NfrDB?retryWrites=true&w=majority&appName=Cluster0`,
	},
};

export { CONFIG };
