import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, FloatingLabel } from "react-bootstrap";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import "./Signup.scss";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/users/signup`, formData, {
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
        <h1>Signup</h1>
      </div>

      <div className="signup-form">
        <Card className="card">
          <Form method="POST" onSubmit={handleSubmit}>
            <FloatingLabel label="Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </FloatingLabel>
            <FloatingLabel label="Email address" className="mb-3">
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="Email address"
              />
            </FloatingLabel>
            <FloatingLabel label="Password">
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                placeholder="Password"
              />
            </FloatingLabel>
            {!loading ? (
              <button type="submit" className="mt-3">
                Signup
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
