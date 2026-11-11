# Correção da integração entre Decap CMS e páginas

## Sintomas corrigidos nesta revisão
- A vitrine de smartphones agora lê os títulos, descrições, imagem, botão e URL do `smartphones/hub_config.json` gerado para `/content/smartphones_hub.json`.
- Os cards inferiores usam os títulos e artigos configurados no Decap. Quando a lista de artigos estiver vazia, mostram uma instrução em vez de produtos de exemplo com links antigos.
- Os filtros de marcas em smartphones, tablets e notebooks são montados a partir dos respectivos `hub_config.json`.
- A home lê os índices de smartphones, tablets e notebooks e mostra os três artigos mais recentes entre as categorias.
- O build inclui o nome da categoria em cada item de índice.

## Configuração obrigatória do Cloudflare Pages
Em Settings > Builds & deployments, use:
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: deixe em branco se o `package.json` está na raiz do repositório.

Sem o build e sem publicar `dist`, os arquivos `/content/*.json` não são gerados e as páginas permanecem com dados fixos ou mostram catálogos vazios.

## Publicação cuidadosa
1. Faça backup e trabalhe numa branch de teste.
2. Copie apenas os arquivos alterados para o repositório; não apague artigos `.md` criados recentemente no Decap.
3. Mantenha os artigos Markdown dentro da pasta da categoria correspondente.
4. Confirme no Decap que o artigo está com `Publicado?` marcado.
5. Faça commit e aguarde um deploy bem-sucedido do Pages.
6. Teste estes caminhos no navegador:
   - `/content/smartphones_hub.json`
   - `/content/smartphones/index.json`
   - `/content/tablets_hub.json`
   - `/content/notebooks_hub.json`
7. Se algum deles der 404, confira o build log e o diretório de saída `dist` antes de alterar o Worker.

## Limitações ainda conhecidas
- `produtos/template.html` ainda precisa de uma integração visual completa dos campos novos de comparativos, SEO e disponibilidade das três lojas.
- O Worker OAuth continua sendo um serviço separado; este pacote não o publica automaticamente.
