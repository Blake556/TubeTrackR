const { google } = require('googleapis');
const express = require('express')
const app = express()
const PORT = 3050
const axios = require('axios');
const cors = require('cors');
require('dotenv').config()

const APIkey = process.env.API_KEY
const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
// Pre me sending access token to front end route
const redirectURL = 'http://localhost:3050/handleOAuthCallback';
// const redirectURL = 'http://localhost:3000';

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

const oauth2Client = new google.auth.OAuth2(
  clientID,
  clientSecret,
  redirectURL
);

const youtubeScopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
];

app.get('/authUrl', async (req, res) => {
     const frontendRedirectUrl = 'http://localhost:3050/handleOAuthCallback';
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: youtubeScopes,
      redirect_uri: frontendRedirectUrl,
    });
    console.log('DID YOU CALL ME')
    res.json({ url: authUrl });
});

// app.get('/authUrl', (req, res) => {
//     const frontendRedirectUrl = 'http://localhost:3050/handleOAuthCallback';
//     const authUrl = oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: youtubeScopes,
//       redirect_uri: frontendRedirectUrl,
//     });
//     console.log('DID YOU CALL ME')
//     res.json({ url: authUrl });
//   });
  


app.get('/handleOAuthCallback', async (req, res) => {
    const code = req.query.code;
    console.log(`Received code: ${code}`);
  
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
  
      console.log('Tokens received:', tokens);
  
      // Redirect to frontend with the access token as a query parameter
      const redirectURLWithAccessToken = `http://localhost:3000?accessToken=${encodeURIComponent(tokens.access_token)}`;

      //fetchLikedVideos(tokens.access_token);
      
      res.redirect(redirectURLWithAccessToken);
    } catch (error) { 
      console.error('Error exchanging code for tokens:', error);
      res.status(500).send('Internal Server Error YES I GOT CALLED');
    }
  });
/*
  app.post('/fetchLikedVideos', async (req, res) => {
    const accessToken = req.body.accessToken;

    try {
        // Use the access token to fetch liked videos
        const likedVideos = await fetchLikedVideos(accessToken);

        // Respond with the liked videos
        res.json({ likedVideos });
    } catch (error) {
        console.error('Error fetching liked videos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/Home', (req, res) => {
  res.json({ message: 'Authorization successful!', data: '' });
});


async function fetchAccessToken(oauth2Client) {
    try {
        const accessToken = oauth2Client.credentials.access_token;
        return accessToken;
    } catch (error) {
        console.log('Error fetching access token', error);
        throw error;
    }
}


const fetchLikedVideos = async (accessToken) => {
    try {
        const response = await fetch('http://localhost:3050/fetchLikedVideos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Liked videos:', data.likedVideos);
            // Handle the received liked videos data as needed
        } else {
            console.error('Failed to fetch liked videos:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching liked videos:', error);
    }
};

// Call this function with the access token once it becomes available
fetchLikedVideos(accessToken);
*/



app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});

