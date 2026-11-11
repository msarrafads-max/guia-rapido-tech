# Guia Rápido Tech — nova arquitetura

Este pacote é uma reconstrução inicial do site usando Eleventy + Decap CMS + Cloudflare Pages.
Ele não publica nada sozinho e não altera o Worker OAuth existente.

## Antes de usar
1. Faça download/backup do repositório atual.
2. Crie uma branch no GitHub chamada `reconstrucao-editorial`.
3. Copie o conteúdo deste ZIP para a raiz do repositório, sem criar uma pasta externa aninhada.
4. Preserve uma cópia de todo artigo, imagem e página legal que exista no site atual.
5. Revise URLs antigas antes de fazer merge para `main`.

## Cloudflare Pages
- Build command: `npm run build`
- Build output directory: `_site`
- Production branch: `main` (somente depois de aprovar os testes)

O projeto precisa instalar as dependências de `package.json`. O build gera o site dentro de `_site/`.

## Decap CMS / OAuth
O `admin/config.yml` usa:
- repo: `msarrafads-max/guia-rapido-tech`
- branch: `main`
- base_url: `https://decap-oauth.msarraf-ads.workers.dev`
- auth_endpoint: `/auth`

O Worker não é implantado pelo Pages. Não substitua o Worker apenas copiando `worker.js` para o repositório. Primeiro teste login, callback e gravação numa branch de teste. A aplicação OAuth do GitHub deve ter callback `https://decap-oauth.msarraf-ads.workers.dev/callback`, se esse for o callback usado pelo Worker implantado.

## Conteúdo
Os artigos são Markdown dentro de `src/content/articles/{smartphones,tablets,notebooks}/`.
As configurações globais ficam em `src/_data/site.json`; configurações das categorias ficam em `src/_data/categories/*.json`.
A home e as categorias usam esses dados e os artigos publicados durante o build.

## Limitações e verificações
- Este pacote é uma base funcional de arquitetura e deve ser testado no ambiente real antes de produção.
- O formato exato das URLs antigas deve ser comparado com o sitemap/links atuais. Não assuma que o slug novo coincide com a URL antiga.
- O Decap CMS não verifica automaticamente se os URLs de afiliado funcionam nem atualiza preços/estoque.
- A seleção de artigos nos cards usa o slug do artigo. Cadastre o slug do review correspondente em `article_slugs`.
- A imagem principal é configurada no formulário do artigo; mantenha imagens dentro de `src/assets/images/uploads/`.
- A opção de cookies deste pacote é um aviso informativo com persistência local. Não é uma plataforma de gestão de consentimento para cookies publicitários/analíticos. Se instalar rastreadores não essenciais, revise as obrigações aplicáveis e implemente consentimento adequado.

## Testes mínimos antes de produção
1. `npm install`
2. `npm run build`
3. Abra `_site/index.html`, `_site/smartphones/index.html`, `_site/tablets/index.html`, `_site/notebooks/index.html`.
4. Teste criação e edição de artigo pelo Decap numa branch de teste.
5. Verifique se o artigo aparece na categoria e na home.
6. Teste modo escuro, aviso de cookies, navegação e links em celular e desktop.
7. Compare URLs antigas e novas; adicione redirecionamentos explícitos quando necessário.


**Data de publicação:** o formulário de artigos inclui campo de data e hora. Para artigos migrados ou com o campo vazio, valide a data resultante no ambiente de teste antes de publicar.
