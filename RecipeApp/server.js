const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./db');
const authRoutes = require('./Routes/authRoutes');
const recipeRoutes = require('./Routes/recipeRoutes');


const app = express();
connectDB();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes)
app.use("/api/recipe", recipeRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});