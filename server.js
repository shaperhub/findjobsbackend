const express = require('express')
const mongoose = require('mongoose')
const Job = require('./models/Job')
const dotenv = require('dotenv')
const cors = require('cors')
const { connect } = require('./utils/db')
const app = express()

// CORS Configuration
app.use(cors());
app.options("", cors());
app.use(function (req, res, next) 
{
    res.header("Access-Control-Allow-Origin", "https://findjobs-gamma.vercel.app/");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers","X-Requested-With, Content-Type");
    res.header("Cache-Control", "no-cache");
    next();
});

// Express Configuration
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Dotenv Configuration
dotenv.config();

// Sample JSON data for testing before database
const jobit = [
    {
      "company": {
        "name": "NewTek Solutions",
        "description": "NewTek Solutions is a leading technology company specializing in web development and digital solutions. We pride ourselves on delivering high-quality products and services to our clients while fostering a collaborative and innovative work environment.",
        "contactEmail": "contact@teksolutions.com",
        "contactPhone": "555-555-5555"
      },
      "_id": "65fe4c6e2a915308349b02cd",
      "title": "Senior React Developer",
      "type": "Full-Time",
      "description": "We are seeking a talented Front-End Developer to join our team in Boston, MA. The ideal candidate will have strong skills in HTML, CSS, and JavaScript, with experience working with modern JavaScript frameworks such as React or Angular.",
      "location": "Boston, MA",
      "salary": "$70K - $80K"
    },
]

//MongoDB Connection
mongoose.set("strictQuery", false)
connect()
.then(() => {
    console.log('connected to MongoDB')
    app.listen(9000, ()=> {
        console.log('React Jobs Backend is running on port 9000')
    });
}).catch((error) => {
    console.log(error)
})


// API CRUD routes

app.get('/', (req, res) => {
    res.send('React Jobs Backend API')
})

// app.get('/jobs', async(req, res) => {
//     res.json(jobit)
// })


// get all jobs
app.get('/jobs', async(req, res) => {
    try {
        const jobs = await Job.find({});
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// get a specific job
app.get('/jobs/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const job = await Job.findById(id);
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// create a job
app.post('/jobs', async(req, res) => {
    try {
        const job = await Job.create(req.body)
        res.status(200).json(job);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// update a job
app.put('/jobs/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const job = await Job.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!job){
            return res.status(404).json({message: `Cannot find any job with ID ${id}`})
        }
        const updatedJob = await Job.findById(id);
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// delete a job
app.delete('/jobs/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const job = await Job.findByIdAndDelete(id);
        if(!job){
            return res.status(404).json({message: `Cannot find any job with ID ${id}`})
        }
        res.status(200).json(job);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
