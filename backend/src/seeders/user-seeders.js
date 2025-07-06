const mongoose = require('mongoose');
const connectDB = require('../config/db-config');
const User = require('../models/user');

const seedUsers = [
    {
        name: "Alice Smith",
        username: "alice",
        email: "alice@example.com"
    },
    {
        name: "Bob Johnson",
        username: "bobby",
        email: "bob@example.com"
    }
];

async function seed() {
    await connectDB();
    await User.deleteMany({});
    await User.insertMany(seedUsers);
    console.log("Users seeded!");
    mongoose.connection.close();
}

seed().catch(err => {
    console.error(err);
    mongoose.connection.close();
});