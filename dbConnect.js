//Here we put our instructions for our database connection
import { MongoClient } from 'mongodb';

import { config } from "dotenv";
config();

const uri = process.env.DB_URL
console.log(uri)
const withDB = async (operations) => {
    try {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("mongoDb database connected");
        const db = client.db("Access_Token_Refresh_Token");
        await operations(db);
        client.close();
    } catch (err) {
        console.error(`Error with database operations: ${err}`);
    }
};

export default withDB;
