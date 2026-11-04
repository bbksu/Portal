import mongoose from "mongoose";


async function mongoConnect() {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/accounts";
    try {
        const mongoConnection = await mongoose.connect(mongoURI);
        console.log(`Database connected at: ${mongoConnection.connection.host}`);
        return mongoConnection;
    } catch (error) {
        mongoConnectionError(error);
    }
    
};

function mongoConnectionError(error) {
	console.log(`MongoDB connection to ${process.env.MONGODB_URI}failed`, error);
	process.exit(1);
};

export {mongoConnect};