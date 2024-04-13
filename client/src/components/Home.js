import React, { useEffect, useState } from 'react';
import './../styles/Home.css';
import Header from "./Header";
import LikedVideoList from './LikedVideoList'
import Search from './Search'

function Home(props) { 
  const [likedVideos, setLikedVideos] = useState([]);
  console.log(likedVideos)

  function addVideoToPlaylist(newVideo) {
// Check if the video is already in the likedVideos array
   // const videoExists = likedVideos.some(video => video.videoId === newVideo.videoId);
    const videoExist = likedVideos.find(video =>  video.videoId === newVideo.videoId)
    console.log(newVideo)
    // If the video is not already in the array, add it
    if (!videoExist) {
      const updatedLikedVideos = [newVideo, ...likedVideos]; // Create a new array with the new video at the beginning
      setLikedVideos(updatedLikedVideos);
    }
  }

  return (
    <div className="Home">
        <Header/>
        <div className="row">
            <div className="side-bar col-1">
            
            </div>
            <div className="col-5">
                <Search 
                  accessToken={props.accessToken}
                  addVideoToPlaylist={addVideoToPlaylist}
                  setLikedVideos={setLikedVideos}
                />
            </div> 
            <div className="col-5">
                <LikedVideoList 
                  accessToken={props.accessToken}
                  likedVideos={likedVideos} 
                  setLikedVideos={setLikedVideos}
                />
            </div> 
            
        </div>
    </div>
  );
}

export default Home;
