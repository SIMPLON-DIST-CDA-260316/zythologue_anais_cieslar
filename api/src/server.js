import express from 'express';
import path from 'node:path';
import beerRoutes from './routes/beerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/beers', beerRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});