import mongoose from "mongoose";

export async function connectDb() {
    try {
        const connect = await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("MongoDB connected:", connect.connection.host);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

export default connectDb;