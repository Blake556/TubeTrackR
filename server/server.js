const { google } = require('googleapis');
const express = require('express')
const app = express()
const PORT = 3050
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');
//This is To keep sensitive data hidden 
require('dotenv').config()

const APIkey = process.env.API_KEY
const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const redirectURL = 'http://localhost:3050/handleOAuthCallback';


//This just makes working with backend port and a seperate front end port and the exchange of data
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
//The data that im requesting from users youtube accounts when they sign in using my app. specified in my goolgle cloud app
const youtubeScopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
];
 
//The first route to be called to initiate the google Oauth proccess
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
  try {
    const { tokens } = await oauth2Client.getToken(code);
    // No need to set credentials here since you're not using them in the backend
    const accessToken = tokens.access_token;
    const redirectURLWithParams = `http://localhost:3000?accessToken=${encodeURIComponent(accessToken)}`;
    res.redirect(redirectURLWithParams);
  } catch (error) { 
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/currentLikedPlaylist', async (req, res) => {
  
  try {
    const { accessToken } = req.query; // Assuming access_token is passed in the query params
    //console.log(accessToken)
    
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
   
    const likedVideos = response.data.items.map((video) => {

      let publishDate = new Date(video.snippet.publishedAt); 
      //console.log(video.snippet.publishedAt)
      let timeAgo = getTimeAgo(publishDate, currentDate);

      //console.log(video.snippet)
      return {
        videoId: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.default.url,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        timeAgo: timeAgo
      };
     
    });

    res.json(likedVideos);
  } catch (error) {
    console.error('Error fetching liked videos:', error);
    res.status(500).send('Internal Server Error');
  }
  
})


// This route is called when form on the front-end is submitted
app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    //console.log('Query Parameter:', query);
    // Communicate with YouTube API to search for videos based on the query
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: APIkey,
        q: query,
        part: 'snippet',
        maxResults: 50 
      }

    });
    
    let searchQuery = response.data.items.map((video) => {

    let publishDate = new Date(video.snippet.publishedAt); 
    let timeAgo = getTimeAgo(publishDate, currentDate);

      return {
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.default.url,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        timeAgo: timeAgo
      };
    });
    // Send back the search results to the frontend
   
    res.json(searchQuery);
  } catch (error) {
    //console.error('Error searching:', error);
    res.status(500).send('Internal Server Error');
  }
});


let currentDate = new Date(); 

function getTimeAgo(publishDate, currentDate) {
  let yearsAgo = currentDate.getFullYear() - publishDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - publishDate.getMonth();
  let daysAgo = Math.floor((currentDate - publishDate) / (1000 * 60 * 60 * 24));
  let weeksAgo = Math.floor(daysAgo / 7);

  if (yearsAgo === 0) {
      if (monthsAgo === 0) {
          if (weeksAgo === 0) {
              return `${daysAgo} days ago`;
          } else {
              return `${weeksAgo} weeks ago`;
          }
      } else {
          return `${monthsAgo} months ago`;
      }
  } else {
      return `${yearsAgo} years ago`;
  }
}



app.post('/addSearchVideoToPlaylist', async (req, res) => {
  const { videoId, accessToken} = req.query;
 
  try {
    const response = await axios.post(
        `https://www.googleapis.com/youtube/v3/videos/rate?id=${videoId}&rating=like&key=${accessToken}`,
        {},
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }
    );

    res.json({ message: 'Video successfully added' });
} catch (error) {
      console.error('Error:', error);
      res.status(500).json('Internal Server Error');
  }
 }
);


app.post('/removeLikedVideo', async (req, res) => {
  const { videoId, accessToken } = req.query;

  try {
    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/videos/rate?id=${videoId}&rating=none&key=${accessToken}`,
      {}, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
    
      // removed from inside down below - response: response.data 
    res.json({ message: 'Video successfully removed'});
  } catch (error) {
    console.error('Error removing video from liked playlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





/*
app.get('/Home', (req, res) => {
  res.json({ message: 'Authorization successful!', data: '' });
});

*/

app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});

