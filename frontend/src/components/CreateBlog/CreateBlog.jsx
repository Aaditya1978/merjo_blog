import { useState, useEffect } from "react";
import { Card, Form, FloatingLabel, Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import "./CreateBlog.scss";

export default function CreateBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/user`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/blog/get_blog/${id}`)
        .then((res) => {
          setTitle(res.data.blog.title);
          setContent(res.data.blog.content);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/blog/create_blog`,
        {
          title,
          content,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/blog/update_blog/${id}`,
        {
          title,
          content,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setLoading(false);
        navigate(`/blog/${id}`);
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  };

  return (
    <>
      <NavBar user={user} />
      <Container className="create-blog">
        <Card className="create-blog-card">
          <Card.Body>
            {!id ? (
              <Card.Title>Create Blog</Card.Title>
            ) : (
              <Card.Title>Update Blog</Card.Title>
            )}
            <Form onSubmit={handleSubmit}>
              <FloatingLabel
                controlId="floatingInput"
                label="Title"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FloatingLabel>
              <FloatingLabel controlId="floatingTextarea2" label="Content">
                <Form.Control
                  as="textarea"
                  placeholder="Content"
                  style={{ height: "100px" }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </FloatingLabel>
              {!id ? (
                !loading ? (
                  <Button variant="primary" type="submit" className="mt-3">
                    Create
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-3"
                    disabled
                  >
                    Creating...
                  </Button>
                )
              ) : !loading ? (
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled
                >
                  Updating...
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
