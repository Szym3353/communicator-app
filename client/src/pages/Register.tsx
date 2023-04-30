import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../store";
import { authUser } from "../store/user";

//Components
import Card from "../components/styled/Card";
import Button from "../components/styled/Button";
import Input from "../components/styled/Input";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  let [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authUser(formData))
      .unwrap()
      .then(() => navigate("/"));
  };

  return (
    <Card title="Register">
      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          value={formData.username}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, username: value }))
          }
        />
        <Input
          label="E-mail adress"
          type="email"
          value={formData.email}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, email: value }))
          }
        />
        <Input
          label="Password"
          value={formData.password}
          type="password"
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, password: value }))
          }
        />
        <Input
          label="Confirm password"
          type="password"
          value={formData.confirmPassword}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, confirmPassword: value }))
          }
        />
        <Button
          style={{ width: "100%", marginTop: "10px", marginBottom: "10px" }}
          value="Register account"
          onClick={() => {}}
          type="submit"
        />
      </form>
      <Link className="url" to="/login">
        Already have an account? Log in.
      </Link>
    </Card>
  );
};

export default Register;
