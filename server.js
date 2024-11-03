// Set up an express server to handle HTTP requests
// Also to conenct to mySQL for storing RSVP Information
// defining an endppoint in order to recieve and store form submissions in database


//start by importing libraries
const express = require('express');// express to handle web server func
const { Pool } = require('pg');// PostgreSQl client for cloud database
const dotenv = require('dotenv') // dotenv for loading environment variables from a .env file
const cors = require('cors');


dotenv.config(); // loading environment variables

const app = express(); //initialize express app 
const PORT = process.env.PORT || 3000; // define the port from env variable or default to 3000

app.use(cors()); //enable cors for all routes
app.use(express.json()); // enables json parsing in req bodies
app.use(express.static('frontend'));

//establishing a connection to postgreSQL using credentials from .env
const db = new Pool({
    host: process.env.DB_HOST, // databse host
    user: process.env.DB_USER, // database user
    password: process.env.DB_PASS, // database password
    database: process.env.DB_NAME,// database name
    port: process.env.DB_PORT
});

//to log when someone accesses the page
app.get('/', (req,res)=>{
    console.log('RSVP page accessed');
    res.sendFile(__dirname + '/frontend/index.html');
})
//creating an enpoint to handle form submission
app.post('/rsvp', async (req, res) => {
    const { name, guests, response } = req.body;

    if (!name || typeof guests !== 'number' || !['yes', 'no', 'maybe'].includes(response)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const query = 'INSERT INTO rsvps (name, guests, response) VALUES ($1, $2, $3)';
        await db.query(query, [name, guests, response]);
        console.log(`RSVP submitted: Name - ${name}, Guests - ${guests}, Response - ${response}`);
        res.json({ message: 'RSVP saved successfully' });
    } catch (err) {
        console.error('Error saving RSVP:', err);
        res.status(500).json({ error: 'Failed to save RSVP' });
    }
});

app.listen(PORT, () =>{ // start the server on the specified port
    console.log(`Server is running on port ${PORT}`);
});




