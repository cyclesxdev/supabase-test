# Supabase teste: Mural de Idéias ⭐

Aplicação React com Vite e Supabase para criar, listar, buscar e remover posts simples.

## Rodando localmente

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis em `.env`:

```bash
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

3. Rode o ambiente de desenvolvimento:

```bash
npm run dev
```

## Scripts

- `npm run dev`: inicia o Vite localmente.
- `npm run build`: gera a versão de produção em `dist`.

## Tabela esperada

O app espera uma tabela `posts` no Supabase com pelo menos:

- `id`: identificador numérico.
- `title`: texto do post.
