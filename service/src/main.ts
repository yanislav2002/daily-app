import "reflect-metadata"
import express from "express"
import { container } from "./DIContainer.js"
import mongoose from "mongoose"
import { InversifyExpressServer } from "inversify-express-utils"
import cors from 'cors'


const PORT = 3000
const DB_NAME = 'daily-app'
const MONGO_DB_PASSWORD = 'notapassword'

const start = () => {
  try {
    mongoose.connect(
      `mongodb+srv://root:${MONGO_DB_PASSWORD}@devcluster.hkshf.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=DevCluster`
    )
      .then(() => { console.log('DB connected successfully') })
      .catch((error: unknown) => { console.log(error) })

    const server = new InversifyExpressServer(container)

    server.setConfig((app) => {
      app.use(express.json())
      app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
      }))
    })

    const app = server.build()

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("Error starting app:", error)
  }
}

start()