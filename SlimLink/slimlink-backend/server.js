const express = require('express');
const mongoose = require('mongoose');

const app = express()
//Allow frontend to communicate with backend since they are on different ports
app.use(cors());
app.use(express.json());

app.listen(5000, () => console.log("Server running on port 5000"));


