import { useEffect, useState } from "react";
import "./App.css";
import { DataStore } from "aws-amplify";
import { Author, Blog, Post } from "./models";

const App = () => {
  const [posts, setPosts] = useState<Post[]>();

  const fetchPosts = async () => {
    const posts = await DataStore.query(Post);
    setPosts(posts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const randString = () => Math.random().toString(36).substring(2);

  const makeTitle = () => `I did a post called ${randString()}`;

  const makeAuthor = async () => {
    let [author] = await DataStore.query(Author);
    if (!author) {
      console.log("No Author item found, creating one");
      author = await DataStore.save(new Author({ name: `Jo ${randString()}` }));
    }
    console.log("Returning author");
    console.log(author);

    return author;
  };

  const getBlog = async () => {
    let [blog] = await DataStore.query(Blog);
    if (!blog) {
      console.log("No Blog item found, creating one");
      blog = await DataStore.save(new Blog({ name: "My first blog" }));
    }
    console.log("Returning blog");
    console.log(blog);

    return blog;
  };

  const addPostNoAuthor = async () => {
    await DataStore.save(
      new Post({
        blog: await getBlog(),
        title: makeTitle(),
      })
    );

    fetchPosts();
  };

  const addPostWithAuthor = async () => {
    const author = await makeAuthor();
    console.log("Got author");
    console.log(author);
    console.log("Making blog post");

    await DataStore.save(
      new Post({
        blog: await getBlog(),
        title: makeTitle(),
        author,
      })
    );

    fetchPosts();
  };

  return (
    <div className="App">
      <button onClick={addPostNoAuthor}>Add a post (no author)</button>
      <button onClick={addPostWithAuthor}>Add a post (with author)</button>

      <h1>Current Posts</h1>
      {!!posts && posts.length > 0 ? (
        posts.map((p) => {
          return (
            <div key={p.id}>
              <h2>{p.title}</h2>
              {p.author && <h3>by {p.author.name}</h3>}
            </div>
          );
        })
      ) : (
        <div>No posts found.</div>
      )}
    </div>
  );
};

export default App;
