import express from 'express'
import cors from 'cors'
import usuariosRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import postRoutes from './routes/postRoutes'
import bookingRoutes from './routes/bookingRoutes'
import cloudflareRoutes from './routes/cloudflareRoutes'
import config from './lib/config'
import dotenv from 'dotenv';

const app = express()
dotenv.config();


app.use(cors())
app.use(express.json())

app.use(usuariosRoutes)
app.use(postRoutes)
app.use(bookingRoutes)
app.use(authRoutes)
app.use(cloudflareRoutes);


const PORT = config.port || 4000
app.listen(PORT, () => {
    console.log(`Tamo en el puerto http://localhost:${PORT}`)
})
