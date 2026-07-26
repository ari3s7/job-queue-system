import express from 'express';
import jobRoutes from "./modules/jobs/jobs.routes.js"

const app = express();

app.use(express.json());
app.use("/", jobRoutes);


export default app;