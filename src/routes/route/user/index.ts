
import { Router, Request, Response } from 'express';
import signUpRouter from './signup/index';

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {

    res.status(200).send({ message: "user router is running!" });
  } catch (error) {
    res.status(404).send({ message: (error as Error).message });
  }
});

router.use("/", signUpRouter);
export default router;