import {Router} from 'express'
import cors from 'cors'
import apiRoutes from './route/api/index'
import userRoutes from './route/user/index'
import { swaggerUI, specs } from '../loaders/swagger';
import { or } from 'sequelize';
import { all } from 'axios';

const router = Router();

const corsOptions = {
  origin: "*",
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

router.use(cors(corsOptions));

router.get("/", (req, res) => {
  try {
    res.status(200).send({ message: "server-client connect success" });
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
});

router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
router.use(
    "/api",
    // basicAuth({
    //   unauthorizedResponse: getUnauthorizedResponse,
    //   authorizer: authorizer,
    //   authorizeAsync: true,
    //   realm: "Imb4T3st4pp",
    //   challenge: false,
    // }),
    apiRoutes
  );
  router.use("/user", userRoutes);
  
  export default router;