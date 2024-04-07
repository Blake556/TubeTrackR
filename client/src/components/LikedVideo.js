import './../styles/LikedVideo.css';
//import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';


function LikedVideo(props) { 
//    async function handleRemoveVideo() {
//     console.log( props.accessToken); 

//     try {
//         const response = await axios.delete('http://localhost:3050/removeLikedVideo', null, {
//             params: { videoId: props.videoId, accessToken: props.accessToken}
//         });

//         console.log('Liked video: ', response.data);
//     } catch (error) {
//         console.error('Error saving liked video to playlist: ', error);
//     }
//    }
async function handleRemoveVideo() {
   
   
    try {
        const response = await axios.post('http://localhost:3050/removeLikedVideo', null, {
            params: { videoId: props.videoId, accessToken: props.accessToken }
        });

        console.log('Liked video: ', response.data);
    } catch (error) {
        console.error('Error removing liked video from playlist: ', error);
    }
}


  return (
    <div className="Liked-video">
        <div className="Liked-video-row row">
            <div className="col-1 d-flex align-items-center justify-content-center">
                <span className='liked-number'>{props.id}</span>
            </div>
            <div className="img-box col-4">
                <img 
                    src={props.thumbnail} 
                    height='100px' 
                    width='175px'
                    className='liked-img'  />
            </div>
            <div className="col-6">
                <div className="liked-title-row row">
                    <p className="liked-title">{props.title.length > 60 ? props.title.substring(0, 60) + '...' : props.title}</p>
                </div>
                <div className="liked-details row">
                <p>{props.channelTitle} &bull; {props. timeAgo}</p>
                </div>
            </div>
            <div className="col-1 remove-like d-flex align-items-center d-flex justify-content-center ">
                <button className='btn remove-like-btn' onClick={handleRemoveVideo}><FontAwesomeIcon icon={faMinus} /></button>
            </div>
        </div>
    </div>
  );
}

export default LikedVideo;
