//Here we put our instructions for our database connection
import { default as mongodb } from 'mongodb';
let MongoClient = mongodb.MongoClient;
const uri = process.env.DB_URL

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
