import './../styles/LikedVideoList.css';
import React, { useEffect, useState } from 'react';
import LikedVideo from './LikedVideo'
import axios from "axios"; 

function LikedVideoList(props) {
 

  function removeFromLikedVideos(videoId) {
    //let videoExist = likedVideos.find(video =>  video.videoId === videoId)
    props.setLikedVideos(props.likedVideos.filter(video => video.videoId !== videoId))
     
  }

  useEffect(() => { 
    // Fetch liked videos using the access token
    if (props.accessToken) {
      axios.get('http://localhost:3050/currentLikedPlaylist', {
        params: {
          accessToken: props.accessToken,
        },
      })
      .then(response => {
        props.setLikedVideos(response.data);
      })
      .catch(error => {
        console.error('Error fetching liked videos:', error);
      });
    }
  }, [props.accessToken]);
  
  
  return (
    <div className="Liked-video-list">
        { props.likedVideos.map((video, index) => (
            <LikedVideo
                accessToken={props.accessToken} 
                id={index} 
                key={index}
                videoId={video.videoId}
                title={video.title}
                channelTitle={video.channelTitle}
                timeAgo={video.timeAgo}
                thumbnail={video.thumbnail} 
                removeFromLikedVideos={removeFromLikedVideos} 
                /> 
        ))}
    </div>
  );
}

export default LikedVideoList;