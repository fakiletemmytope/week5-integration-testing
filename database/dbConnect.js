import mongoose from "mongoose"
import { configDotenv } from "dotenv"

configDotenv()
const { connect, connection } = mongoose
const URI = process.env.NODE_ENV === 'test' ? process.env.TESTDBURL : process.env.DATABASEURL;



export const dbConnect = async () => {
    try {
        await connect(`${URI}`)
        // console.log('MongoDB connected successfully!')
        return
    }
    catch (error) {
        // console.log(error.message)
        await connection.close()
        throw error
    }
}

export const dbClose = async () => {
    if (connection.readyState === 1) {
        await connection.close()
        // console.log("Database connection closed!")
    }
}

