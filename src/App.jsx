import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function getFriendlyError(error, action) {
    if (error?.message?.includes("row-level security")) {
      return `O Supabase bloqueou ${action} por causa das policies de RLS da tabela posts.`;
    }

    return `Nao foi possivel ${action} agora. Tente novamente em alguns segundos.`;
  }

  async function loadPosts() {
    setIsLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setError(getFriendlyError(error, "carregar os posts"));
      setPosts([]);
      setIsLoading(false);
      return;
    }

    setPosts(data || []);
    setIsLoading(false);
  }

  async function createPost() {
    const cleanTitle = title.trim();
    if (!cleanTitle || isSaving) return;

    setIsSaving(true);
    setError("");

    const { error } = await supabase
      .from("posts")
      .insert([{ title: cleanTitle }]);

    if (error) {
      setError(getFriendlyError(error, "salvar"));
      setIsSaving(false);
      return;
    }

    setTitle("");
    await loadPosts();
    setIsSaving(false);
  }

  async function deletePost(id) {
    const previousPosts = posts;
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
    setError("");

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      setPosts(previousPosts);
      setError(getFriendlyError(error, "remover este post"));
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return posts;

    return posts.filter((post) =>
      String(post.title || "").toLowerCase().includes(term)
    );
  }, [posts, search]);

  const latestPost = posts[0]?.title || "Nada publicado ainda";

  return (
    <div className="app-shell">
      <main className="workspace">
        <section className="intro">
          <div>
            <span className="eyebrow">Supabase + Vercel</span>
            <h1>Mural de ideias</h1>
            <p>
              Publique notas rapidas, acompanhe o historico e teste sua conexao
              com o Supabase em uma interface mais completa.
            </p>
          </div>

          <button className="ghost-button" onClick={loadPosts} disabled={isLoading}>
            {isLoading ? "Atualizando..." : "Atualizar"}
          </button>
        </section>

        <section className="stats-grid" aria-label="Resumo dos posts">
          <div className="stat-panel">
            <span>Total</span>
            <strong>{posts.length}</strong>
          </div>
          <div className="stat-panel">
            <span>Na busca</span>
            <strong>{filteredPosts.length}</strong>
          </div>
          <div className="stat-panel wide">
            <span>Mais recente</span>
            <strong>{latestPost}</strong>
          </div>
        </section>

        <section className="composer" aria-label="Criar post">
          <div className="field-group">
            <label htmlFor="title">Novo post</label>
            <div className="input-row">
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") createPost();
                }}
                placeholder="Escreva um titulo..."
                maxLength={120}
              />

              <button onClick={createPost} disabled={!title.trim() || isSaving}>
                {isSaving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>

          <span className="character-count">{title.trim().length}/120</span>
        </section>

        {error ? <div className="status-message error">{error}</div> : null}

        <section className="posts-section" aria-label="Lista de posts">
          <div className="section-heading">
            <div>
              <h2>Posts</h2>
              <p>Filtre, revise e remova itens do mural.</p>
            </div>

            <input
              className="search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar..."
            />
          </div>

          {isLoading ? (
            <div className="status-message">Carregando posts...</div>
          ) : filteredPosts.length ? (
            <div className="post-list">
              {filteredPosts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div>
                    <span className="post-id">#{post.id}</span>
                    <h3>{post.title}</h3>
                  </div>

                  <button
                    className="danger-button"
                    onClick={() => deletePost(post.id)}
                    aria-label={`Remover ${post.title}`}
                  >
                    Remover
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>{search ? "Nenhum resultado" : "Seu mural esta vazio"}</h3>
              <p>
                {search
                  ? "Tente outro termo de busca."
                  : "Crie o primeiro post para ver a lista ganhar vida."}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
