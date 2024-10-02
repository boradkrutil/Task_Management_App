import mongoose from "mongoose";


const dbconnection = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.log(error);
        console.error('Error connecting to MongoDB:');
        process.exit(1);
    }
}

export default dbconnection;