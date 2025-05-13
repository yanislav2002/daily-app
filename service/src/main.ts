import "reflect-metadata"
import express from "express"
import { container } from "./DIContainer"
import { ExampleController } from "./controllers/ExampleController"


const app = express()
const port = 3000

const start = () => {
  try {
    // Connect to MongoDB
    // await mongoose.connect("mongodb://localhost:27017/your_db", {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // } as any);
    // console.log("Connected to MongoDB");

    // Set up routes
    const exampleController = container.get<ExampleController>(ExampleController)
    app.get("/", exampleController.getHello)

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  } catch (error) {
    console.error("Error starting app:", error)
  }
}

start()
