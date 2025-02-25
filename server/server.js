import express from "express"
import cors from "cors"
import  "dotenv/config"
import cookieParser from "cookie-parser"
import  connectDB  from "./config/mongodb.js";
import  {authRouter}  from "./routes/AuthRoutes.js";
import  {userRouter}  from "./routes/UserRoutes.js";
import { categoryRouter } from "./routes/CategoryRoutes.js";
import { backetRouter } from "./routes/BacketRoutes.js";
import { raportRouter } from "./routes/RaportRoutes.js";
import { lotRouter } from "./routes/LotRoutes.js";
import { contractRouter } from "./routes/ContractRoutes.js";
import { companyRouter } from "./routes/CompanyRoutes.js";
import { rfqRouter } from "./routes/RFQRoutes.js";
const app = express();
const port = process.env.SERVER_PORT || 4000
connectDB()

const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials:true}))




app.get('/',(req,res) => {
    res.send("API ISLEYIR!")
})
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/backet", backetRouter)
app.use("/api/raports", raportRouter)
app.use("/api/lots", lotRouter)
app.use("/api/contracts", contractRouter)
app.use("/api/companies", companyRouter)
app.use("/api/rfqs", rfqRouter)

app.listen(port, () => console.log(
    "Server "+port+" nömrəli portda işləyir"
)
)