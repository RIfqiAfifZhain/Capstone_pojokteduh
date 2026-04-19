import express from "express";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import adminsRoutes from "./routes/admins.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/admins", adminsRoutes);
app.use(errorHandler);

// Jalankan servernya
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
