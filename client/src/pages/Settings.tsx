import React from "react";
import { useNavigate } from "react-router-dom";
import SettingsContent from "../components/Settings/SettingsContent";
import Button from "../components/styled/Button";
import "../css/settings.css";

type menuOption = { category: string; options: string[] };

let menuOptions: menuOption[] = [
  { category: "User settings", options: ["My account", "Profile"] },
  { category: "Application settings", options: ["Style", "Devices"] },
];

const Settings = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = React.useState<string>(
    menuOptions[0].options[0]
  );

  return (
    <div className="settings">
      <ul className="settings-menu">
        {menuOptions.map((category) => (
          <li className="settings-menu__category" key={category.category}>
            <h3 className="settings-menu-category__title">
              {category.category}
            </h3>
            <ul className="settings-menu-category__options">
              {category.options.map((option) => (
                <li
                  onClick={() => setSelectedOption(option)}
                  className="settings-menu-category__option"
                >
                  {option}
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li>
          <Button
            value="BACK"
            variant="clear"
            onClick={() => {
              navigate("..");
            }}
          />
        </li>
      </ul>
      <SettingsContent selectedOption={selectedOption} />
    </div>
  );
};

export default Settings;
