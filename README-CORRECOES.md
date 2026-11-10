# Guia Rápido Tech — pacote de correções

## O que este pacote corrige/prepara
- Configuração do Decap apontando para o Worker OAuth correto.
- Remoção da dependência desnecessária do Netlify Identity.
- Formulários editoriais mais completos para smartphones, tablets e notebooks.
- Arquivos de configuração das vitrines editáveis pelo CMS.
- Script de build que cria índices JSON a partir dos artigos Markdown para que o site estático consiga descobrir artigos novos.
- Worker OAuth com state assinado, cookie de estado, validações básicas e origem de postMessage configurável.

## Antes de publicar
1. Faça backup/download do repositório atual.
2. Confira `backend.repo` em `admin/config.yml` e `site_url`.
3. Instale dependências e gere a versão de produção: `npm install` e `npm run build`.
4. Configure Cloudflare Pages: Build command `npm run build`; Build output directory `dist`; Production branch `main`.
5. No Worker, crie variáveis/secrets: `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `STATE_SECRET` (string aleatória forte com pelo menos 32 caracteres) e `ALLOWED_ORIGIN` (origem exata usada para abrir o CMS, por exemplo `https://guiarapidotech.com.br`). Se o CMS também for usado por `https://www.guiarapidotech.com.br`, o Worker precisará permitir explicitamente ambas as origens com uma lista/validação, em vez de um único valor.
6. Na GitHub OAuth App, o Authorization callback URL deve ser `https://decap-oauth.msarraf-ads.workers.dev/callback`.
7. Teste o login e publique um artigo de teste antes de alterar artigos existentes.

## Observações importantes
- O Worker deve ser publicado no painel Cloudflare como Worker separado; o arquivo `worker.js` aqui é o código-fonte de referência, não é servido pelo Cloudflare Pages.
- Não coloque `OAUTH_CLIENT_SECRET`, tokens ou `STATE_SECRET` no GitHub.
- O CMS cria artigos Markdown dentro de cada pasta de categoria. O build gera `content/<categoria>/index.json` automaticamente.
- O arquivo `produtos/template.html` original continua presente e ainda contém comparativos padrão antigos. Antes de publicar, a seção de comparativos/ofertas desse template deve ser atualizada para renderizar todos os campos novos (`comparativos`, disponibilidade das três lojas e metadados SEO). Não publique como concluído até fazer esse teste visual.
- A lista de artigos é gerada no build, portanto as mudanças no GitHub precisam disparar um novo deploy do Cloudflare Pages.
