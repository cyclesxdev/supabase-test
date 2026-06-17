# Mural de ideias

Aplicacao React com Vite e Supabase para criar, listar, buscar e remover posts simples.

## Rodando localmente

1. Instale as dependencias:

```bash
npm install
```

2. Configure as variaveis em `.env`:

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
- `npm run build`: gera a versao de producao em `dist`.

## Tabela esperada

O app espera uma tabela `posts` no Supabase com pelo menos:

- `id`: identificador numerico.
- `title`: texto do post.
