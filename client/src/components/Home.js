import './../styles/Home.css';
import Header from "./Header";
import LikedVideoList from './LikedVideoList'
import Search from './Search'

function Home(props) {

  return (
    <div className="Home">
        <Header/>
        <div className="row">
            <div className="side-bar col-1">
            
            </div>
            <div className="col-5">
                <LikedVideoList accessToken={props.accessToken}/>
            </div> 
            <div className="col-5">
                <Search accessToken={props.accessToken}/>
            </div> 
        </div>
    </div>
  );
}

export default Home;
