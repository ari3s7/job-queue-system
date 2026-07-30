import type{Request, Response} from 'express';
import { createJobSchema } from './jobs.validator.js';
import { createJob } from './jobs.service.js';

export async function jobController(req: Request, res: Response) {
    try {
   const result  = createJobSchema.safeParse(req.body);
   if(result.success) {
    const job = await createJob(result.data)

   return res.status(201).json({
    success: true,
    data: job,
   })
   } else {
    return res.status(400).json({
        success: false,
        errors: result.error.issues,
    })
   } 
} catch (error){
    console.error(error)
    return res.status(500).json({
        success: false,
        message: "Server side failure"
    })
}
}   