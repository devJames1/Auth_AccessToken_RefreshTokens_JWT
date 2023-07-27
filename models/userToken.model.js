
// creatining index on time to live (TTL) fields to auto delete document after a time. 
async function createTTLIndex(db) {
    try {
        // Create the TTL index on the 'createdAt' field (or any other field you want to use for expiration).
        await db.collection("users_token").createIndex({ createdAt: 1 }, { expireAfterSeconds: 30 * 86400 });// 30days

        console.log('TTL index created successfully!');

    } catch (err) {
        console.error('Error creating TTL index:', err);
    }
}



export { createTTLIndex }