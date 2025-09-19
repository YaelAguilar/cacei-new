// src/index.ts - Probar routers uno por uno
import express from 'express';
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { authMiddleware } from './utils/middlewares/authMiddleware';

const app = express();
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedDomains = process.env.AVAILABLE_DOMAINS
  ? process.env.AVAILABLE_DOMAINS.split(',').map(domain => domain.trim())
  : [];

console.log("Dominios permitidos", allowedDomains);

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

const port = process.env.PORT_SERVER;
const now = new Date();

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Express + TypeScript!');
});

console.log('🔍 Probando routers uno por uno...');

try {
  console.log('1️⃣ Cargando authRouter...');
  const { authRouter } = require('./auth/infrastructure/authRouter');
  app.use("/api/v1/auth", authRouter);
  console.log('✅ authRouter registrado');
} catch (error) {
  console.error('❌ Error en authRouter:', error);
}

try {
  console.log('2️⃣ Cargando userRouter...');
  const { userRouter } = require('./users/infrastructure/userRouter');
  app.use("/api/v1/users", authMiddleware, userRouter);
  console.log('✅ userRouter registrado');
} catch (error) {
  console.error('❌ Error en userRouter:', error);
}

try {
  console.log('3️⃣ Cargando subMenuRouter...');
  const { subMenuRouter } = require('./submenus/infrastructure/subMenuRouter');
  app.use("/api/v1/submenus", subMenuRouter);
  console.log('✅ subMenuRouter registrado');
} catch (error) {
  console.error('❌ Error en subMenuRouter:', error);
}

try {
  console.log('4️⃣ Cargando menuRouter...');
  const { menuRouter } = require('./menus/infrastructure/menuRouter');
  app.use("/api/v1/menus", menuRouter);
  console.log('✅ menuRouter registrado');
} catch (error) {
  console.error('❌ Error en menuRouter:', error);
}

try {
  console.log('5️⃣ Cargando roleRouter...');
  const { roleRouter } = require('./roles/infrastructure/roleRouter');
  app.use("/api/v1/roles", roleRouter);
  console.log('✅ roleRouter registrado');
} catch (error) {
  console.error('❌ Error en roleRouter:', error);
}

// COMENTAR ESTAS LÍNEAS UNA POR UNA PARA ENCONTRAR EL PROBLEMA

try {
  console.log('6️⃣ Cargando convocatoriaRouter...');
  const { convocatoriaRouter } = require('./convocatorias/infrastructure/convocatoriaRouter');
  app.use("/api/v1/convocatorias", authMiddleware, convocatoriaRouter);
  console.log('✅ convocatoriaRouter registrado');
} catch (error) {
  console.error('❌ Error en convocatoriaRouter:', error);
}

try {
  console.log('7️⃣ Cargando propuestaRouter...');
  const { propuestaRouter } = require('./propuestas/infrastructure/propuestaRouter');
  app.use("/api/v1/propuestas", authMiddleware, propuestaRouter);
  console.log('✅ propuestaRouter registrado');
} catch (error) {
  console.error('❌ Error en propuestaRouter:', error);
}

try {
  console.log('8️⃣ Cargando commentRouter...');
  const { commentRouter } = require('./propuestas-comentarios/infrastructure/commentRouter');
  app.use("/api/v1", authMiddleware, commentRouter);
  console.log('✅ commentRouter registrado');
} catch (error) {
  console.error('❌ Error en commentRouter:', error);
}

console.log('🎯 Intentando iniciar servidor...');

app.listen(port, () => {
  console.log("🚀 Servidor iniciado exitosamente en puerto: " + port);
  console.log(now.toLocaleString());
});

console.log('✅ Si ves este mensaje, el servidor inició sin errores de path-to-regexp');