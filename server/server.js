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
let tokens;

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
/*
// 'handleOAuthCallback'route will use res.json({ url: authUrl }); and extract the data using code variable. 
app.get('/handleOAuthCallback', async (req, res) => {
  const code = req.query.code;
  try {
    ({ tokens } = await oauth2Client.getToken(code));
    oauth2Client.setCredentials(tokens);
    // Call fetchLikedVideos and wait for it to resolve
    const likedVideos = await fetchLikedVideos(tokens);

     // encodeURIComponent will make the accesstoken formated so it cant be sent through a url. JSON.stringify will turn the obj or array into a string so it can be successfully sent
    const accessTokenParam = encodeURIComponent(tokens.access_token);
    // encodeURIComponent will make likedVideos formated so it cant be sent through a url. JSON.stringify will turn the obj or array into a string so it can be successfully sent
    const likedVideosParam = encodeURIComponent(JSON.stringify(likedVideos));

    //The url that res.redirect will use with accessTokenParam and likedVideosParam will be sent to front end in url
    const redirectURLWithParams = `http://localhost:3000?accessToken=${accessTokenParam}&likedVideos=${likedVideosParam}`;
    //Redirect to frontend with the access token and liked videos
    res.redirect(redirectURLWithParams);
  } catch (error) { 
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Internal Server Error');
  }
});
*/
app.get('/currentLikedPlaylist', async (req, res) => {
  const { accessToken } = req.query;
  console.log(accessToken)
  
  try {
    const { accessToken } = req.query; // Assuming access_token is passed in the query params
    console.log(accessToken)
    
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
    
      return {
        videoId: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.default.url,
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
    console.log('Query Parameter:', query);
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
      return {
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.default.url
      };
    });
    // Send back the search results to the frontend
   
    res.json(searchQuery);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/addSearchVideoToPlaylist', async (req, res) => {
  const { videoId, accessToken} = req.query;
  console.log('VideoId: '+  videoId + ' Token: '+ accessToken);
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

    const updatedLikedVideos = await fetchLikedVideos({ access_token: accessToken });
    res.json({ message: 'Video added to liked playlist', updatedLikedVideos });
} catch (error) {
      console.error('Error:', error);
      res.status(500).json('Internal Server Error');
  }
 }
);

app.delete('/removeLikedVideo', async (req, res) => {
  const { videoId, accessToken } = req.query;
  console.log('VideoId: ' + videoId + ' Token: ' + accessToken);

  try {
      // Make a DELETE request to remove the video from the liked playlist
      const response = await axios.delete(
          `https://www.googleapis.com/youtube/v3/playlistItems`,
          {
              params: {
                  id: videoId, // ID of the playlist item (video) to be removed
              },
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          }
      );

      // If the deletion is successful, respond with a success message
      res.json({ message: 'Video removed from liked playlist', response: response.data });
  } catch (error) {
      console.error('Error removing video from liked playlist:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.delete('/removeLikedVideo', async (req, res) => {
//   const { videoId, accessToken} = req.query;
//   console.log('VideoId: '+  videoId + ' Token: '+ accessToken);
//   try {
//     // Make a DELETE request to remove the video from the liked playlist
//     const response = await axios.delete(
//       `https://www.googleapis.com/youtube/v3/playlistItems`,
//       {
//         params: {
//           id: videoId, // ID of the playlist item (video) to be removed
//         },
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     // If the deletion is successful, respond with a success message
//     res.json({ message: 'Video removed from liked playlist', response: response.data });
//   // try {
//   //   const response = await axios.post(
//   //     `https://www.googleapis.com/youtube/v3/videos/rate?id=${videoId}&rating=like&key=${accessToken}`,
//   //     {},
//   //     {
//   //         headers: {
//   //             'Authorization': `Bearer ${accessToken}`,
//   //             'Content-Type': 'application/json'
//   //         }
//   //     }
//   //     );

//   //   res.json('Request recieved')
//   } catch (error) {
//     console.log('Error ', error)
//     res.status(500).send('Internal Server Error');
//   }
// })




/*
app.get('/Home', (req, res) => {
  res.json({ message: 'Authorization successful!', data: '' });
});

*/

app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});

