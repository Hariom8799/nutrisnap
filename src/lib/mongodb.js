import mongoose from "mongoose";



const connection  = {};

export async function connectToDatabase(){
    if(connection.isConnected){
        console.log("Already connected to the database");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "");

        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to the database");
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}









// import mongoose from 'mongoose'

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
// }

// const uri = process.env.MONGODB_URI
// let client
// let clientPromise
// if (process.env.NODE_ENV === 'development') {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   let globalWithMongo = global  
//   if (!globalWithMongo._mongoClientPromise) {
//     client = mongoose.connect(uri)
//     globalWithMongo._mongoClientPromise = client
//   }
//   clientPromise = globalWithMongo._mongoClientPromise
// } else {
//   // In production mode, it's best to not use a global variable.
//   client = mongoose.connect(uri)
//   clientPromise = client
// }

// // Export a module-scoped MongoClient promise. By doing this in a
// // separate module, the client can be shared across functions.
// export default clientPromise

// export async function connectToDatabase() {
//   await clientPromise
//   return mongoose.connection.db
// }