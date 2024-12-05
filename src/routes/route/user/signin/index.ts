import { Router, Request, Response } from 'express';
import axios from 'axios';
import {User, mapRowToUser, handleUserLogin } from './../../../../models/user';
require('dotenv').config();
const router = Router();

//db test
import pool from '../../../../loaders/db'
import { RowDataPacket } from 'mysql2';
import { error } from 'console';

router.post("/signin", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      res.status(200).json({
          status: 200,
          message: "login success",
        });
      
    } catch (error) {
      res.status(404).send({ message: (error as Error).message });
    }
  });

  export default router;

