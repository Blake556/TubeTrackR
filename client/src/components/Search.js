import React, { useEffect, useState } from "react";
import "./../styles/Search.css";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import axios from "axios";

function Search(props) {
  //This will store the state of anything typed in search bar
  const [searchBar, setSearchBar] = useState("");
  // Once handleSubmit function sends the search state to express backend for results handleSubmit will also receive the result object and setSearchResults
  const [searchResults, setSearchResults] = useState([]);
  console.log(searchResults);

  //This function will setSearch state for use when sending to express
  function handleInputChange(event) { 
    setSearchBar(event.target.value);
  }


  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSearchResults([]);
      const response = await axios.get("http://localhost:3050/search", {
        params: {
          query: searchBar,
        },
      });
      setSearchResults(response.data);
      //console.log('Search results success!', response.data);
    } catch (error) {
      console.log("Error searching:", error);
    }
  }

  
  return (
    <div className="search-component ">
      
        <SearchBar
          searchBar={searchBar}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
    
      <div className="search-results-list">
        {searchResults.map((video, index) => (
          <SearchResults
            videoId={video.videoId}
            key={index}
            title={video.title}
            thumbnail={video.thumbnail}
            channelTitle={video.channelTitle}
            timeAgo={video.timeAgo}
            accessToken={props.accessToken}
          />
        ))}
      </div>
    </div>
  );
}

export default Search;
