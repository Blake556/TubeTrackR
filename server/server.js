const { google } = require('googleapis');
const express = require('express')
const app = express()
const PORT = 3050
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');

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

    res.json({ url: authUrl });
});


app.get('/handleOAuthCallback', async (req, res) => {
  const code = req.query.code;
  //console.log(`Received code: ${code}`);

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    //console.log('Tokens received:', tokens);

    // Call fetchLikedVideos and wait for it to resolve
    const likedVideos = await fetchLikedVideos(tokens);
    
    // Redirect to frontend with the access token and liked videos as query parameters
    const accessTokenParam = encodeURIComponent(tokens.access_token);
    const likedVideosParam = encodeURIComponent(JSON.stringify(likedVideos));
    const redirectURLWithParams = `http://localhost:3000?accessToken=${accessTokenParam}&likedVideos=${likedVideosParam}`;
    res.redirect(redirectURLWithParams);
  } catch (error) { 
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Internal Server Error');
  }
});



async function fetchLikedVideos(tokens) {
  try {
    const accessToken = tokens.access_token;
    //console.log('Token passed', accessToken)
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

    console.log(response.data.items[6]);
    const likedVideos = response.data.items.map((video) => {
      return {
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.default.url,
      };
    });
    //console.log(likedVideos);
    return likedVideos;
  } catch (error) {
    console.log('Error fetching liked videos', error);
    throw error;
  }
}



//   app.post('/fetchLikedVideos', async (req, res) => {
//     const accessToken = req.body.accessToken;
//     console.log('uno ', accessToken)
//     try {
//         // Use the access token to fetch liked videos
//         const likedVideos = await fetchLikedVideos(accessToken);
//         // Respond with the liked videos
//         res.json({ likedVideos });
//     } catch (error) {
//         console.error('Error fetching liked videos:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


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


/*
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
*/


/*
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
*/

app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});

