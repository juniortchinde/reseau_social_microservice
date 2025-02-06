const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("connected to MongoDB"))
.catch((err) => console.log("Failed to connect to MongoDB", err));
