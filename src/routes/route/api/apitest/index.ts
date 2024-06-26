import { Router, Request, Response } from 'express';
import cors from 'cors'
const router = Router();

router.post("/test", cors(), async (req: Request, res: Response) => {
  try {
    console.log("api test 들어옴")
    console.log(req.body); 

    res.status(200).send({ message: "Received data", data: req.body });
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
});

export default router;  