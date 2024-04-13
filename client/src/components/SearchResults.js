import React, { useEffect, useState } from "react";
import "./../styles/SearchResults.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function SearchResults(props) {
  console.log("likedVideos in SearchResults:", props.likedVideos);


  async function handleAddLikeVideo(videoId) {
    const newVideo = {
      videoId: props.videoId, 
      thumbnail: props.thumbnail, 
      title: props.title,  
      channelTitle: props.channelTitle, 
      timeAgo: props.timeAgo
    };

    try {
     
      const response = await axios.post( 
        "http://localhost:3050/addSearchVideoToPlaylist",
        null,
        {
          params: { videoId: props.videoId, accessToken: props.accessToken },
        }
       
      ); 
      
        props.addVideoToPlaylist(newVideo);
    } catch (error) {
        console.error("Error saving liked video to playlist: ", error);
    }
  }

  return (
    <div className="Search-result-container">
      <div className="Search-result row ">
        <div className="result-img-box col-4">
          <img
            src={props.thumbnail}
            height="100px"
            width="175px"
            className="result-liked-img"
          />
        </div>
        <div className="col-7 result-video-details">
          <div className="results-video-title ">
            <p>{props.title.length > 60 ? props.title.substring(0, 60) + '...' : props.title}</p>
          </div>
          <div className="result-channel-title">
            <p>
              {props.channelTitle} &bull; {props.timeAgo}
            </p>
          </div>
        </div>
        <div className="col-1 d-flex align-items-center justify-content-center">
          <button 
            className='like-video-btn'
            onClick={handleAddLikeVideo}>
            <FontAwesomeIcon icon={faThumbsUp} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
