const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const profRouter = require("./routes/profRouter");
const app = express();
const hostname = "127.0.0.1";
const PORT = 3010;

mongoose
  .connect("mongodb://localhost/final_project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Succesfully connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/profs/public/uploads", express.static("public/uploads"));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profs", profRouter);

app.listen(PORT, () => {
  console.log(`Listening at http://${hostname}:${PORT}`);
});
