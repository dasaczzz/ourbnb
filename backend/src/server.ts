import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import usuariosRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import postRoutes from './routes/postRoutes'
import bookingRoutes from './routes/bookingRoutes'
import cloudflareRoutes from './routes/cloudflareRoutes'
import reviewRoutes from './routes/reviewRoutes'
import config from './lib/config'
import dotenv from 'dotenv';

const app = express()
dotenv.config();

app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:3000', 
    'https://frontend-ourbnb-p6n7u.ondigitalocean.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))

// Trust proxy para Digital Ocean
app.set('trust proxy', 1);

app.use(express.json())
app.use(cookieParser())

app.use(usuariosRoutes)
app.use(postRoutes)
app.use(bookingRoutes)
app.use(authRoutes)
app.use(cloudflareRoutes)
app.use(reviewRoutes)

// Puerto flexible para Digital Ocean
const PORT = Number(process.env.PORT) || config.port || 4000

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
