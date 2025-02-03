import express from "express"
import cors from "cors"
import  "dotenv/config"
import cookieParser from "cookie-parser"
import  connectDB  from "./config/mongodb.js";
import  {authRouter}  from "./routes/AuthRoutes.js";
import  {userRouter}  from "./routes/UserRoutes.js";

const app = express();
const port = process.env.SERVER_PORT || 4000
connectDB()

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}))




app.get('/',(req,res) => {
    res.send("API ISLEYIR!")
})
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.listen(port, () => console.log(
    "Server "+port+" nömrəli portda işləyir"
)
)