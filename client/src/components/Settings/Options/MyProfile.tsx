import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { updateUser } from "../../../store/user";
import Button from "../../styled/Button";
import Card from "../../styled/Card";
import Input from "../../styled/Input";

type value = { category: string; value: string };

const MyProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  let user = useSelector((state: RootState) => state.user.data);
  let [value, setValue] = React.useState<value>({} as value);
  let [password, setPassword] = React.useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const SingleOption = ({
    category,
    currentValue,
  }: {
    category: string;
    currentValue: string;
  }) => {
    return (
      <div className="settings-option">
        <p className="settings-option__info">
          <span className="settings-option__title">{category}:</span>
          <span className="settings-option__current-value">{currentValue}</span>
        </p>
        <Button
          value="Edit"
          onClick={() => setValue({ category, value: "" })}
        />
      </div>
    );
  };

  return (
    <>
      <Card containerStyles={{ marginBottom: "20px" }}>
        <SingleOption category="Username" currentValue={user?.username || ""} />
        <SingleOption category="Email" currentValue={user?.email || ""} />
        <SingleOption
          category="Phone number"
          currentValue={user?.settings?.phone || "Phone number is not set"}
        />
      </Card>
      {value.category && (
        <Card containerStyles={{ marginBottom: "20px" }}>
          <Input
            label={`New ${value.category}`}
            autocomplete="off"
            onChange={(e) => setValue((prev) => ({ ...prev, value: e }))}
          />
          <div style={{ display: "flex" }}>
            <Button
              style={{ marginRight: "10px" }}
              value="Save"
              onClick={() =>
                dispatch(
                  updateUser({
                    ...value,
                    category: value.category.toLowerCase(),
                  })
                )
              }
            />
            <Button
              variant="clear"
              color="red"
              value="Cancel"
              onClick={() => setValue({} as value)}
            />
          </div>
        </Card>
      )}
      <Card title="Change password">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(updateUser(password));
          }}
        >
          <Input
            type="password"
            label="Old password"
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, oldPassword: e }))
            }
          />
          <Input
            type="password"
            label="New password"
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, newPassword: e }))
            }
          />
          <Input
            type="password"
            label="Confirm new password"
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, confirmNewPassword: e }))
            }
          />
          <Button type="submit" value="Save new password" onClick={() => {}} />
        </form>
      </Card>
    </>
  );
};

export default MyProfile;
