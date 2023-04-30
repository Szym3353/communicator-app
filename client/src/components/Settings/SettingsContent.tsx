import React from "react";
import MyProfile from "./Options/MyProfile";
import Profile from "./Options/Profile";

const SettingsContent = ({ selectedOption }: { selectedOption: string }) => {
  function getOption() {
    switch (selectedOption) {
      case "My account":
        return <MyProfile />;
      case "Profile":
        return <Profile />;
      default:
        return <MyProfile />;
    }
  }

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">{selectedOption}</h2>
      {getOption()}
    </div>
  );
};

export default SettingsContent;
