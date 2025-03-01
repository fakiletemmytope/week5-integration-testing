import { configDotenv } from "dotenv";
import { dbClose, dbConnect } from "./database/dbConnect.js";
import mongoose from "mongoose";

configDotenv();


beforeEach(async () => {
    await dbConnect();
});



afterEach(async () => {
    await dbClose();
});


beforeAll(async () => {

});

afterAll(async () => {
    await dbConnect()
    await mongoose.connection.db.dropDatabase();
    await dbClose()
});
