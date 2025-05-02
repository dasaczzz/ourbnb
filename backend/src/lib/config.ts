import dotenv from 'dotenv'
import { Secret } from 'jsonwebtoken'

dotenv.config()

interface Config {
  port: number
  jwt_secret?: Secret
}

const config: Config = {
  port: Number(process.env.PORT),
  jwt_secret: process.env.JWT_SECRET
}

export default config
