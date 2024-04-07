import './../styles/LikedVideoList.css';
import React, { useEffect, useState } from 'react';
import LikedVideo from './LikedVideo'
import axios from "axios"; 

function LikedVideoList(props) {
  const [likedVideos, setLikedVideos] = useState([]);
  console.log(likedVideos)


  useEffect(() => {
    // Fetch liked videos using the access token
    if (props.accessToken) {
      axios.get('http://localhost:3050/currentLikedPlaylist', {
        params: {
          accessToken: props.accessToken,
        },
      })
      .then(response => {
        setLikedVideos(response.data);
      })
      .catch(error => {
        console.error('Error fetching liked videos:', error);
      });
    }
  }, [props.accessToken]);
  
  
  return (
    <div className="Liked-video-list">
        { likedVideos.map((video, index) => (
            <LikedVideo
                accessToken={props.accessToken} 
                id={index} 
                key={index}
                videoId={video.videoId}
                title={video.title}
                channelTitle={video.channelTitle}
                timeAgo={video.timeAgo}
                thumbnail={video.thumbnail}  
                /> 
        ))}
    </div>
  );
}

export default LikedVideoList;