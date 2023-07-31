import bodyparser from "body-parser";
import express from "express";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import orderRoutes from "./orderRoutes";

const app = express();

app.use(bodyparser.json());
app.use(userRoutes);
app.use(productRoutes);
app.use(orderRoutes);

export default app;
