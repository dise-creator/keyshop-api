import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { platformsRouter } from "./routes/platforms";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/platforms", platformsRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
