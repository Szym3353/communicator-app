import React from "react";
import Card from "../../styled/Card";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import CropImageComponent from "../../CropImage/CropImageComponent";
import Avatar from "../../styled/Avatar";

const Profile = () => {
  let user = useSelector((state: RootState) => state.user.data);

  return (
    <Card>
      <div className="settings-option">
        <div className="settings-option__info">
          <p className="settings-option__title">avatar</p>
          <Avatar
            src={user?.avatarURL || ""}
            size="100px"
            style={{ margin: "10px 0 " }}
          />
        </div>
        <CropImageComponent />
      </div>
    </Card>
  );
};

export default Profile;
