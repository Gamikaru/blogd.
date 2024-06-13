import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import './db/connection.js';
import { authenticate } from './middleware/authMiddleware.js';

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/post', authenticate, postRoutes);
app.use('/comment', commentRoutes);
app.use('/session', authenticate, sessionRoutes);

// start the Express server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export default app;