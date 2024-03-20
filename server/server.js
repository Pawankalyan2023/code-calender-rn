
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const xpath = require('xpath');
// const { config } = require('dotenv');
// const pool = require('./db');
require('dotenv').config();
const Port = process.env.PORT || 3001;


app.use(cors());

app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const url1 = process.env.url1; 
    const url2 = process.env.url2; 
  
    const [response1, response2] = await Promise.all([
      axios.get(url1),
      axios.get(url2)
    ]);


    const data1 = response1.data.objects || [];
    const data2 = response2.data.objects || [];

    const combinedData = [...data1, ...data2];

    console.log(combinedData);


    res.json(combinedData);
  } catch (error) {
    
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';

  try {
    const response = await pool.query(query, [email, password]);

    if (response.rowCount === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
    } else {
      res.status(200).json({ message: 'Login successful' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Failed to login user' });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, username, password } = req.body;

  const query = 'INSERT INTO users (email, username, password) VALUES ($1, $2, $3)';

  try {
    const response = await pool.query(query, [email, username, password]);

    if (response.rowCount === 1) {
      res.status(200).json({ message: 'User registered successfully' });
    } else {
      res.status(500).json({ message: 'Failed to register user' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

app.post('/updateDetails', async(req, res)=>{
  try {
    const {leetcode, codechef, codeforces} = req.body;
    const leetcodeProfile = await axios.get(`https://leetcard.jacoblin.cool/${leetcode}?ext=contest`);

    const codechefProfile = await axios.get(`https://codechef-api.vercel.app/${codechef}`);

    const codeforcesProfile = await axios.get(`https://codeforces.com/api/user.info?handles=${codeforces}`)

    

    res.status(200).json({
      leetcodeProfile: leetcodeProfile.data,
      codechefProfile: codechefProfile.data,
      codeforcesProfile: codeforcesProfile.data,
    })

  } catch (error) {
    
  }
})


app.listen(Port, () => {
  console.log('Server is running on port 3001');
});
