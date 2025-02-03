import mongoose from "mongoose";


 const connectDB = async () => {
    mongoose.connection.on('connected', ()=> console.log("Verilənlər Bazası ilə bağlantı yaradıldı")
    )
    await mongoose.connect(process.env.DATABASE_URL)
}

export default connectDB