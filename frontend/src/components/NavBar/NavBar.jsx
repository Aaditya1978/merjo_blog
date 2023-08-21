import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./NavBar.scss";

export default function NavBar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
        withCredentials: true,
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>
          <Link className="linke" to="/">
            Blog App
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {!user ? (
            <Nav>
              <Button
                variant="outline-light"
                className="me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="outline-light"
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
            </Nav>
          ) : (
            <Nav>
              <Button
                variant="outline-light"
                className="me-2"
                onClick={() => navigate("/create-blog")}
              >
                Create Blog
              </Button>
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
