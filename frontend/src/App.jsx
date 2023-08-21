import { BrowserRouter, Routes , Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Signup from "./components/Signup/signup";
import Login from "./components/Login/Login";
import CreateBlog from "./components/CreateBlog/CreateBlog";
import Blog from "./components/Blog/Blog";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/create-blog" exact element={<CreateBlog />} />
          <Route path="/update-blog/:id" exact element={<CreateBlog />} />
          <Route path="/blog/:id" exact element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
