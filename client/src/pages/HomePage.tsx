import React from "react";

//Components
import ChatContainer from "../components/HomePage/Chat/ChatContainer";
import SideBar from "../components/HomePage/SideBar/SideBar";

//Css
import "../css/homepage.css";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <SideBar />
      <ChatContainer />
    </div>
  );
};

export default HomePage;
