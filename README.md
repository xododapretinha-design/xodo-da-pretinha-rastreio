# 🌸 Xodó da Pretinha - Sistema de Rastreio de Encomendas

Um sistema premium e moderno de rastreamento de encomendas de ponta a ponta (Full-Stack) projetado especificamente para a boutique online **Xodó da Pretinha**. O sistema permite que clientes acompanhem o progresso das suas compras de forma dinâmica e interativa, enquanto fornece aos administradores um painel completo para gerenciar status, editar informações e notificar clientes automaticamente por e-mail.

---

## ✨ Recursos Principais

### 👤 Área do Cliente
- **Acesso Descomplicado:** Login prático digitando o código de rastreamento (ex: `XODO-PT-101`) ou através de links diretos de auto-login enviados por e-mail.
- **Timeline Interativa:** Acompanhamento visual dos 4 estágios da encomenda com animações suaves e cores exclusivas para cada etapa:
  1. 📦 **Aquisição** (Tons Dourados) - Compra e controle de qualidade na origem.
  2. 🎀 **Empacotamento** (Tons Roxos) - Preparação física e embalagem perfumada.
  3. ✈️ **Envio para Angola** (Tons Rosas) - Trânsito aéreo internacional via TAAG.
  4. 🏠 **Disponível para Retirada** (Tons Esmeralda) - Pronto para ser retirado no ponto de distribuição em Talatona, Luanda.
- **Comprovante de Envio Premium:** Visualização detalhada da encomenda com suporte a impressão física formatada (`@media print`) contendo QR Code simulado e layout limpo.

### 👑 Painel do Administrador
- **Autenticação Segura:** Login protegido com token HMAC assinado.
- **Bento Dashboard:** Métricas em tempo real (Total de encomendas, Em Trânsito, Entregues, Receita Estimada).
- **Gerenciamento de Encomendas:** Criar novas encomendas com múltiplos itens, editar dados de clientes (nome, e-mail, destino), e registrar notas detalhadas no histórico de trânsito.
- **Transição de Estágios Simplificada:** Atualize o estágio com um único clique. O sistema se encarrega de registrar no histórico e enviar o e-mail correspondente.

### 📧 Automação de E-mails com Resend
- Integração nativa com a API do **Resend** para disparos rápidos.
- **Templates Customizados:** 4 modelos de e-mail HTML modernos e responsivos (um para cada fase), contendo placeholders para personalização de nome, código de rastreio, produtos e mensagens de histórico.
- **Fallback Automático:** Caso ocorra algum erro na leitura dos templates físicos, o sistema dispara um e-mail HTML padrão robusto sem interromper o fluxo da aplicação.

---

## 🛠️ Stack Tecnológica

- **Frontend:** HTML5 Semântico, Javascript Moderno (ES6+) como Single Page Application (SPA), CSS3 com variáveis dinâmicas (HSL) e visual Glassmorphism.
- **Backend:** Node.js, Express, Cors, dotenv.
- **Banco de Dados:** **Supabase (PostgreSQL)** com suporte a JSONB para histórico e produtos. Possui fallback automático para arquivo JSON local (`data/orders.json`) em ambiente de desenvolvimento.
- **Disparo de E-mails:** **Resend SDK**.
- **Hospedagem Recomendada:** **Vercel** (Serverless Functions para o backend + CDN estático para o frontend).

---

## 📁 Estrutura de Pastas

```text
Ratreio/
├── data/
│   └── orders.json          # Banco de dados JSON local (fallback / dev local)
├── templates/
│   ├── 1_acquisition.html   # Template de e-mail para Fase 1 (Aquisição)
│   ├── 2_packaging.html     # Template de e-mail para Fase 2 (Empacotamento)
│   ├── 3_shipping.html      # Template de e-mail para Fase 3 (Envio)
│   └── 4_reception.html     # Template de e-mail para Fase 4 (Recepção)
├── app.js                   # Lógica e rotas da SPA no Frontend
├── index.html               # Estrutura HTML da SPA
├── styles.css               # Design Visual e responsividade (Glassmorphism e Print)
├── server.js                # API Express e Integração Supabase/Resend
├── supabase_schema.sql      # Script de criação de tabelas e seeds para o Supabase
├── vercel.json              # Configuração de rotas serverless para Vercel
├── package.json             # Dependências do projeto
├── .gitignore               # Arquivos a ignorar no git
├── .env.example             # Modelo das variáveis de ambiente necessárias
└── .env                     # Variáveis locais (Não comitar!)
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Ter o [Node.js](https://nodejs.org) instalado.
- Ter o Git instalado para versionamento.

### 2. Clonar e Instalar Dependências
```bash
# Clone este repositório
git clone <url-do-seu-repositorio>
cd Ratreio

# Instale as dependências
npm install
```

### 3. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo e preencha com suas credenciais:
```bash
cp .env.example .env
```
Abra o arquivo `.env` e configure:
- `RESEND_API_KEY`: Sua chave de API obtida na aba API Keys do Resend.
- `ADMIN_PASSWORD`: A senha que você usará para acessar o painel admin.
- `JWT_SECRET`: Uma frase secreta para garantir a segurança da sessão do admin.
- `SUPABASE_URL` e `SUPABASE_ANON_KEY` (Opcional localmente, obrigatório na nuvem): URL e chave anônima do seu projeto Supabase. Se deixados como padrão, o sistema usará o banco de dados JSON local `data/orders.json`.

### 4. Rodar o Servidor
```bash
npm run dev
# ou
node server.js
```
Acesse no seu navegador: `http://localhost:8080`

---

## ☁️ Implantação em Produção (Vercel & Supabase)

### Passo 1: Configurar Banco de Dados no Supabase
1. Crie uma conta ou acesse o [Supabase](https://supabase.com/).
2. Crie um novo projeto.
3. No painel do projeto, vá em **SQL Editor** e clique em **New Query**.
4. Copie o conteúdo do arquivo [supabase_schema.sql](file:///Users/fr.utxicascj/Desktop/Ratreio/supabase_schema.sql) deste repositório, cole no editor e clique em **Run**. Isso criará a tabela e inserirá dados de teste.
5. Vá em **Project Settings -> API** e copie o **Project URL** e a chave **anon public**.

### Passo 2: Configurar o Domínio no Resend
1. Cadastre-se no [Resend](https://resend.com/).
2. Vá em **Domains** e adicione o domínio do seu site (ex: `xododapretinha.shop`).
3. Adicione os registros DNS apontados pelo Resend no seu provedor de domínio (como GoDaddy, Hostgator, Cloudflare).
4. Após a verificação do domínio, você poderá enviar e-mails de `qualquer-coisa@seu-dominio.com` para qualquer cliente externo. 
   *(Nota: Contas gratuitas do Resend sem domínio verificado só podem enviar e-mails para o e-mail de cadastro da própria conta).*

### Passo 3: Publicação na Vercel
1. Crie ou conecte sua conta na [Vercel](https://vercel.com/).
2. Adicione um novo projeto e conecte com o repositório do GitHub criado.
3. Durante a etapa de configuração, clique em **Environment Variables** e adicione todas as chaves contidas no seu arquivo `.env`:
   - `PORT` = 8080
   - `RESEND_API_KEY` = (sua chave real)
   - `ADMIN_USER` = (seu usuário admin)
   - `ADMIN_PASSWORD` = (sua senha segura)
   - `JWT_SECRET` = (seu segredo longo)
   - `EMAIL_FROM` = `Xodó da Pretinha <contato@seu-dominio-verificado.com>`
   - `SUPABASE_URL` = (sua url do supabase)
   - `SUPABASE_ANON_KEY` = (sua chave anon do supabase)
4. Clique em **Deploy**. A Vercel cuidará do build e fornecerá um link HTTPS seguro para acessar o sistema de qualquer lugar.

---

## 🔒 Segurança e Melhores Práticas
- **Sem Estado (Stateless):** O backend Express foi configurado para rodar em funções serverless da Vercel. Toda a leitura e gravação em produção é feita de forma assíncrona no Supabase, garantindo que nenhum dado seja perdido quando a função serverless for desalocada ou reiniciada.
- **Exclusão de Arquivos Sensíveis:** O arquivo `.env` está explicitamente no `.gitignore` para prevenir vazamentos acidentais de tokens.

---

## 🖤 Licença
Este projeto foi desenvolvido com carinho para uso exclusivo da boutique **Xodó da Pretinha**. Todos os direitos reservados.
