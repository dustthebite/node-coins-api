require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');


mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({extended: false}))
const appRouter = require("./routes/routes");
const coinRouter = require("./routes/coinRoutes");
const userRouter = require("./routes/userRoutes");
app.use("/api", [appRouter, coinRouter, userRouter]);

app.listen(3000, () => {    
    console.log('Server started on port 3000');
});  