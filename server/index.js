import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); //enable cross origin sharing (for the front end to call this API)
app.use(express.json()); //parse json bodies

//define simple route test
app.get("/", (req,res) =>{
    res.send("Server is running..."); //test message
});

//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});