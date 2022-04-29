const express = require("express");

const app = express();
const db = require("./models");

const corsMiddleware = require("./middlewares/cors");
const verifyTokenMiddleware = require("./middlewares/verifyToken");

const authRoutes = require("./router/auth.routes");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(corsMiddleware);

app.use("/api", authRoutes);

app.use(verifyTokenMiddleware);

db.sequelize.sync().then(() => {
	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});
});
