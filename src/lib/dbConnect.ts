import mongoose from "mongoose"


type ConnectType = {
    isConnected?: Number
}

const connection: ConnectType = {}
 
async function dbConnect():Promise<void> {
    if(connection.isConnected) {
        console.log("DB already connected")
        return
    }

try {
        const db = await mongoose.connect(process.env.MONGO_URI!)
        console.log("Db Object",db, db.connections[0].readyState)
        connection.isConnected = db.connections[0].readyState
        console.log("connection.isConnected", connection.isConnected)
} catch (error) {
    console.log("Db connection Failed", error)
}
}

dbConnect()
export default dbConnect