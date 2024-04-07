import React from "react";
import "./../styles/SearchResults.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function SearchResults(props) {
    
  async function handleAddLikeVideo() {
    console.log(props.videoId);
    try {
      const response = await axios.post(
        "http://localhost:3050/addSearchVideoToPlaylist",
        null,
        {
          params: { videoId: props.videoId, accessToken: props.accessToken },
        }
      ); 

      console.log("Liked video: ", response.data);
    } catch (error) {
      console.error("Error saving liked video to playlist: ", error);
    }
  }

  return (
    <div className="Search-result-container">
      <div className="Search-result row">
        <div className="img-box col-4">
          <img
            src={props.thumbnail}
            height="100px"
            width="175px"
            className="liked-img"
          />
        </div>
        <div className="col-7">
          <div className="liked-title row">
            <p>{props.title}</p>
          </div>
          <div className="liked-details row">
            <p>
              {props.channelTitle} &bull; {props.timeAgo}
            </p>
          </div>
        </div>
        <div className="col-1 d-flex align-items-center justify-content-center">
          <button onClick={handleAddLikeVideo}>
            <FontAwesomeIcon icon={faThumbsUp} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
