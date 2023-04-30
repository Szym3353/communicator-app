import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../store";
import { authUser } from "../store/user";

//Components
import Card from "../components/styled/Card";
import Button from "../components/styled/Button";
import Input from "../components/styled/Input";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authUser(formData))
      .unwrap()
      .then(() => navigate("/"));
  };

  return (
    <Card title="Login">
      <form onSubmit={handleSubmit}>
        <Input
          label="E-mail adress"
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, email: value }))
          }
        />
        <Input
          label="Password"
          type="password"
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, password: value }))
          }
        />
        <Button
          onClick={() => {}}
          value="Login"
          type="submit"
          style={{ width: "100%", marginTop: "10px", marginBottom: "10px" }}
        />
      </form>
      <Link className="url" to="/register">
        Don't have account yet? Register now.
      </Link>
    </Card>
  );
};

export default Login;
