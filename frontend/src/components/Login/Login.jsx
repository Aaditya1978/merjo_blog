import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Form, FloatingLabel } from "react-bootstrap";
import NavBar from "../NavBar/NavBar";
import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/users/login`, formData, {
        withCredentials: true,
      })
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        alert(err.response.data.error);
      });
  };

  return (
    <>
      <NavBar />
      <div className="header">
        <h1>Login</h1>
      </div>

      <div className="login-form">
        <Card className="card">
          <Form method="POST" onSubmit={handleSubmit}>
            <FloatingLabel label="Email address" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </FloatingLabel>
            <FloatingLabel label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </FloatingLabel>
            {!loading ? (
              <button type="submit" className="mt-3">
                Login
              </button>
            ) : (
              <button type="submit" className="mt-3" disabled>
                Loading...
              </button>
            )}
          </Form>
        </Card>
      </div>
    </>
  );
}
