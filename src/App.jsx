import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    setPosts(data || []);
  }

  async function createPost() {
    if (!title.trim()) return;

    await supabase
      .from("posts")
      .insert([{ title }]);

    setTitle("");
    loadPosts();
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div style={{
      maxWidth: "800px",
      margin: "50px auto",
      fontFamily: "Arial"
    }}>
      <h1>Supabase + Vercel</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
      />

      <button onClick={createPost}>
        Salvar
      </button>

      <hr />

      {posts.map(post => (
        <div key={post.id}>
          {post.title}
        </div>
      ))}
    </div>
  );
}