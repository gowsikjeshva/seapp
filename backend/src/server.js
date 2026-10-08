import mongoose from 'mongoose'; import app from './app.js'; import { env } from './config/env.js';
mongoose.connect(env.mongoUri).then(() => { console.log('Connected to MongoDB'); app.listen(env.port, () => console.log(`API listening on port ${env.port}`)); }).catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
