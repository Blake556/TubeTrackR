import React, { useEffect, useState } from "react";
import "./../styles/Search.css";
import SearchResults from "./SearchResults";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';



function Search(props) {
  //This will store the state of anything typed in search bar
  const [search, setSearch] = useState("");
  // Once handleSubmit function sends the search state to express backend for results handleSubmit will also receive the result object and setSearchResults
  const [searchResults, setSearchResults] = useState([]);
  //console.log(search);
  // let grabDate = searchResults.map(date => {
  //   return date.publishTime
  // });

console.log(searchResults)
 

  //This function will setSearch state for use when sending to express
  function handleInputChange(event) {
    setSearch(event.target.value);
    
  }



  //   useEffect(() => {
  //   }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    //console.log("Query Parameter:", search); 
    try {
      setSearchResults([]);
      const response = await axios.get("http://localhost:3050/search", { params: {
    query: search,
  }
});
      setSearchResults(response.data);
     //console.log('Search results success!', response.data);
    } catch (error) {
      console.log("Error searching:", error);
    }
  }


  return (
    <div className="search-component ">
      <div className="search-container d-flex  align-items-center justify-content-center">
        <form
          className="search-form"
          action=""
          method=""
          onSubmit={handleSubmit}
        >
          <input
            className="search-bar"
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleInputChange}
          />
          <button className="search-btn" type="submit" >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
      </div>
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
