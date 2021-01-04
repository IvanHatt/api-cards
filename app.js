const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./Routes/userRouter");
const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://localhost/final_project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Succesfully connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB"));

app.use(express.json());

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT} `);
});
