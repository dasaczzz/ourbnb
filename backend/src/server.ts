import express from 'express'
import cors from 'cors'
import usuariosRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import config from './lib/config'

const app = express()

app.use(cors())
app.use(express.json())

app.use(usuariosRoutes)
//app.use(authRoutes)

const PORT = config.port || 4000
app.listen(PORT, () => {
    console.log(`Tamo en el puerto http://localhost:${PORT}`)
})
