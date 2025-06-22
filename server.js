const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

//const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE_LOCAL.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

// process.on('unhandledRejection', err => {
//     console.log('Unhandled Rejection! 💥 Shutting down...');
//     console.log(err.name, err.message);
//     server.close(() => {
//         process.exit(1);
//     });
// });
// process.on('uncaughtException', err => {
//     console.log('Uncaught Exception! 💥 Shutting down...');
//     console.log(err.name, err.message);
//     server.close(() => {
//         process.exit(1);
//     });
// });