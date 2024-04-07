import React from "react";
import "./../styles/SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchBar(props) {
    
  const handleInputChange = (event) => {
    props.handleInputChange(event);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.handleSubmit(event);
  };

  return ( 
    <div className="search-bar-container d-flex align-items-center justify-content-center">
      <form className="search-form " action="" method="" onSubmit={handleSubmit}>
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          value={props.searchBar}
          onChange={handleInputChange}
        />
        <button className="search-btn" type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
