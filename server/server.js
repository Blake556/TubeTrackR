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
const redirectURL = 'http://localhost:3050/handleOAuthCallback';

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



app.get('/authUrl', (req, res) => {
    const frontendRedirectUrl = 'http://localhost:3050/handleOAuthCallback';
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: youtubeScopes,
      redirect_uri: frontendRedirectUrl,
    });
    console.log('DID YOU CALL ME')
    res.json({ url: authUrl });
  });
  

  app.get('/handleOAuthCallback', async (req, res) => {
    const code = req.query.code;
    console.log(`Received code: ${code}`);
  
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
  
      console.log('Tokens received:', tokens);
  
      const likedVideos = await fetchLikeVideos(oauth2Client);
      console.log('CALL ME!!!!!', likedVideos);
  
      // Append likedVideos as a query parameter to the redirect URL
      const redirectURLWithLikedVideos = `http://localhost:3000?likedVideos=${encodeURIComponent(JSON.stringify(likedVideos))}`;
  
      // Redirect to frontend with likedVideos as a query parameter
      res.redirect(redirectURLWithLikedVideos);
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      res.status(500).send('Internal Server Error YES I GOT CALLED');
    }
  });
  

app.get('/Home', (req, res) => {
  res.json({ message: 'Authorization successful!', data: '' });
});





async function fetchLikeVideos(oauth2Client) {
    try {
      const accessToken = oauth2Client.credentials.access_token;
      const endpoint = 'https://www.googleapis.com/youtube/v3/videos';
      const params = {
        videoCategoryId: 10,
        part: 'snippet',
        myRating: 'like',
        maxResults: 50,
      };
  
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: params,
      });
  
      console.log(response.data || 'NOTHING');
      return response.data.items.map((video) => {
        return {
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.default.url,
        };
      });
    } catch (error) {
      console.log('Error fetching liked videos', error);
      throw error;
    }
  }
  

  

app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});

