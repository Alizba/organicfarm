import mongoose from "mongoose";

export async function connect() {
    try{
        if (mongoose.connections[0].readyState) return;
        mongoose.connect(process.env.MONGO_URL)
        const connection = mongoose.connection

        connection.on('connected' , () => {
            console.log("MongoDB connected")
        })

        connection.on('error' , (err) => {
            console.log("Mongodb connection error, please make sure db is up and running:", err)
            process.exit()
            
        })

    }
    catch(e){
        console.log("Something had happened!!" , e)
    }
}