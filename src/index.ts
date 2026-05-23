import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import path from "path";
import { platformsRouter } from "./routes/platforms";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/auth";
import { fetchAndUpdateCbrRates } from "./services/currency";

dotenv.config();
console.log("TOKEN:", process.env.TELEGRAM_BOT_TOKEN?.slice(0, 10));

import { initBot } from "./bot/admin";
import { initCustomerBot } from "./bot/customer";  // 👈 добавили

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

const frontendPath = path.join(__dirname, "../keyshop-frontend/dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await fetchAndUpdateCbrRates();
  } catch (err) {
    console.error("Ошибка обновления курсов ЦБ:", err);
  }

  initBot();
  initCustomerBot();  // 👈 добавили

  cron.schedule(
    "0 10 * * *",
    async () => {
      console.log("Крон: обновляем курсы ЦБ...");
      try {
        await fetchAndUpdateCbrRates();
      } catch (err) {
        console.error("Крон: ошибка обновления курсов:", err);
      }
    },
    { timezone: "Europe/Moscow" }
  );

  console.log("Крон запущен: курсы обновляются каждый день в 10:00 МСК");
});