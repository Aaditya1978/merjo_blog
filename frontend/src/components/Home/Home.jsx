import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { DotLoader } from "react-spinners";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import "./Home.scss";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/blog/get_blogs`)
      .then((res) => {
        setBlogs(res.data);
      })
      .then(() => {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/users/user`, {
            withCredentials: true,
          })
          .then((res) => {
            setUser(res.data);
          })
          .catch((err) => {
            console.log(err);
          })
          .then(() => {
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <NavBar user={user} />
      <div className="header">
        <h1>Blog Posts</h1>
      </div>

      {loading ? (
        <div className="loader">
          <DotLoader color="#1F64FF" loading={loading} size={100} />
        </div>
      ) : (
        <Container className="blogs">
          {blogs.map((blog) => (
            <Card key={blog.id} className="blog">
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Text>{blog.content.slice(0, 20)}...</Card.Text>
                <div className="footer">
                  <div>
                    Created - {new Date(blog.created_at).toLocaleString()}
                  </div>
                  <div>
                    <Button onClick={() => navigate(`/blog/${blog.id}`)}>
                      View blog
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Container>
      )}
    </>
  );
}
