import Router from 'express';
import { jobController } from './jobs.controller.js';

const router = Router();

router.post("/", jobController);


export default router;