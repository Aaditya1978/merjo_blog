import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Modal,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { DotLoader } from "react-spinners";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import "./Blog.scss";

export default function Blog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState();
  const [author, setAuthor] = useState();
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/blog/get_blog/${id}`)
      .then((res) => {
        setBlog(res.data.blog);
        setAuthor(res.data.author);
      })
      .then(() => {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/blog/get_comments/${id}`)
          .then((res) => {
            setComments(res.data);
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/blog/create_comment/${id}`,
        {
          content,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setContent("");
        setFormSubmitted(false);
        setShow(false);
      })
      .then(() => {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/blog/get_comments/${id}`)
          .then((res) => {
            setComments(res.data);
          });
      })
      .catch((err) => {
        alert(err.response.data.error);
        setFormSubmitted(false);
      });
  };

  return (
    <>
      <NavBar user={user} />
      <div className="header">
        <h1>Blog Posts</h1>
      </div>

      <Modal className="modal" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form method="POST" onSubmit={handleSubmit}>
            <FloatingLabel label="Leave a comment here" className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ height: "100px" }}
              />
            </FloatingLabel>
            {!formSubmitted ? (
              <Button variant="primary" type="submit">
                Submit
              </Button>
            ) : (
              <Button variant="primary" disabled>
                Submitting...
              </Button>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {loading ? (
        <div className="loader">
          <DotLoader color="#1F64FF" loading={loading} size={100} />
        </div>
      ) : (
        <Container className="blog-cont">
          <Card className="blog">
            <Card.Body>
              <Card.Title>{blog.title}</Card.Title>
              <Card.Text>{blog.content}</Card.Text>
              <div className="footer">
                <div>
                  Author - <span>{author.name}</span>
                </div>
                <div>
                  Created On -{" "}
                  <span>{new Date(blog.created_at).toLocaleString()}</span>
                </div>
                <div>
                  Last Updated -{" "}
                  <span>{new Date(blog.updated_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="actions">
                {user && (
                  <Button onClick={() => setShow(true)}>Create Comment</Button>
                )}
                {user && user.id === author.id && (
                  <Button onClick={() => navigate(`/update-blog/${id}`)}>
                    Update Blog
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          <div className="comments">
            <h2>Comments</h2>
            {comments.map((comment) => (
              <Card key={comment.id} className="comment">
                <Card.Body>
                  <Card.Text>{comment.content}</Card.Text>
                  <div className="footer">
                    <div>
                      Author - <span>{comment.author_name}</span>
                    </div>
                    <div>
                      Created On -{" "}
                      <span>
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
