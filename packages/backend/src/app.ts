import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import eventsRoutes from './routes/events.routes';
import offersRoutes from './routes/offers.routes';
import ordersRoutes from './routes/orders.routes';
import ticketsRoutes from './routes/tickets.routes';
import usersRoutes from './routes/users.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'API e-billets JO 2024 opérationnelle' });
});

// 📚 Swagger UI interactive documentation
app.use(
  '/api/docs',
  swaggerUi.serve as unknown as express.RequestHandler,
  swaggerUi.setup(swaggerDocument as object)
);

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/events', eventsRoutes);

app.use(errorHandler);

export default app;
