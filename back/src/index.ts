// src/index.ts
import express from 'express';
import * as dotenv from "dotenv"
import cors from "cors";
import cookieParser from 'cookie-parser';
import { authMiddleware } from './utils/middlewares/authMiddleware';

//Routers
import { userRouter } from './users/infrastructure/userRouter';
import { subMenuRouter } from './submenus/infrastructure/subMenuRouter';
import  { menuRouter } from './menus/infrastructure/menuRouter'
import { roleRouter } from './roles/infrastructure/roleRouter';
import { authRouter } from './auth/infrastructure/authRouter';
import { convocatoriaRouter } from './convocatorias/infrastructure/convocatoriaRouter';
import { propuestaRouter } from './propuestas/infrastructure/propuestaRouter'; // Nuevo router

// Scheduler de convocatorias
import { convocatoriaScheduler } from './convocatorias/infrastructure/dependencies';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const allowedDomains = process.env.AVAILABLE_DOMAINS
  ? process.env.AVAILABLE_DOMAINS.split(',').map(domain => domain.trim())
  : [];

console.log("Dominios permitidos")
console.log(allowedDomains)


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedDomains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

const port=process.env.PORT_SERVER;
const now = new Date();

app.listen(port,()=>{
    console.log("listening on port: "+port)
    console.log(now.toLocaleString());
});


app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Express + TypeScript!');
});

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users", authMiddleware ,userRouter);
app.use("/api/v1/submenus", subMenuRouter)
app.use("/api/v1/menus",menuRouter);
app.use("/api/v1/roles",roleRouter);
app.use("/api/v1/convocatorias", authMiddleware, convocatoriaRouter);
app.use("/api/v1/propuestas", authMiddleware, propuestaRouter); // Nueva ruta

// Inicializar scheduler de convocatorias
convocatoriaScheduler.startScheduler();