<p align="center">
  <h1 align="center">✨ EducaSenai - Frontend ✨</h1>
</p>

<p align="center">
  <strong>Interface do usuário (Frontend) para a plataforma EducaSenai</strong><br>
  Desenvolvido como Trabalho de Conclusão de Curso (TCC)<br>
  Curso: <strong>Desenvolvimento de Sistemas</strong><br>
  Instituição: <strong>SENAI Santo Amaro - Suíço-Brasileira</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue?style=for-the-badge" alt="Status: Em Desenvolvimento">
  <img src="https://img.shields.io/github/languages/count/PeresDev01/EducaSenai?style=for-the-badge&color=orange" alt="GitHub language count"> 
  </p>

---

## 📜 Índice

* [🎯 Sobre o Projeto](#-sobre-o-projeto)
* [🚀 Funcionalidades Principais](#-funcionalidades-principais)
* [💻 Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [⚙️ Pré-requisitos](#-pré-requisitos)
* [🛠️ Como Executar Localmente](#-como-executar-localmente)
* [📸 Screenshots](#-screenshots)
* [🔗 Conexão com o Backend](#-conexão-com-o-backend)
* [📁 Estrutura de Pastas](#-estrutura-de-pastas)
* [🤝 Equipe](#-equipe)
* [👨‍🏫 Orientador](#-orientador)
* [📝 Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **EducaSenai** é uma plataforma web desenvolvida com o objetivo de servir como uma **plataforma educacional de reforço escolar** para alunos e estudantes. Através de uma interface intuitiva e funcionalidades interativas, busca-se  melhorar o engajamento, facilitar o acompanhamento do progresso, conectar alunos e mentores.

Este repositório contém exclusivamente o código-fonte do **Frontend** da aplicação, responsável por toda a interação visual e experiência do usuário.

---

## 🚀 Funcionalidades Principais

* 👤 **Autenticação Segura:**
    * Cadastro e Login distintos para Alunos e Mentores.
    * Verificação de permissões (role) no frontend para direcionamento correto.
* 🛤️ **Trilhas de Aprendizado Interativas:**
    * Visualização clara do progresso nas matérias (IOT, SOP, etc.).
    * Marcação de etapas concluídas.
* 📊 **Dashboard do Aluno:**
    * Acompanhamento de "Ofensivas" (streak diário de estudos).
    * Acesso rápido a feedbacks recebidos dos mentores.
    * Interface para solicitar e visualizar agendamentos de reuniões.
* 👨‍🏫 **Dashboard do Mentor:**
    * Visualização e acompanhamento dos alunos associados.
    * Ferramentas para envio de feedbacks construtivos.
    * Gerenciamento de solicitações de reuniões (aceitar/recusar/visualizar).
* 💬 **Agendamento de Reuniões:**
    * Formulário para alunos selecionarem mentor, data, hora e modalidade.
    * Visualização do status das solicitações (Pendente, Confirmada, Recusada).
    * Calendário visual de reuniões confirmadas.
* 📝 **Sistema de Feedbacks:**
    * Alunos podem visualizar todos os feedbacks recebidos, com filtros e ordenação.
    * Funcionalidade de marcar feedbacks como lidos/não lidos.
* ⚙️ **Gerenciamento de Perfil:**
    * Visualização dos dados cadastrais.
    * Funcionalidade para upload e atualização da foto de perfil (avatar).

---

## 💻 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias no frontend:

* **HTML5:** Para a estrutura semântica e acessível das páginas.
* **CSS3:** Para estilização, layout responsivo (Flexbox, Grid) e animações.
* **JavaScript (ES6+):** Para toda a interatividade, lógica de negócio no cliente, manipulação do DOM e comunicação com a API.
* **API Fetch:** Para realizar requisições HTTP assíncronas ao backend.
* **Bibliotecas Externas:**
    * `Toastify.js`: Exibição de notificações não-bloqueantes (toasts).
    * `SweetAlert2`: Criação de modais e alertas mais elegantes e interativos.
* **Ferramentas de Desenvolvimento:**
    * **Git & GitHub:** Para controle de versão e colaboração.
    * **Visual Studio Code (ou outro editor):** Ambiente de desenvolvimento.

---

## ⚙️ Pré-requisitos

Para visualizar ou executar este projeto localmente, você precisará apenas de:

* 🌐 **Navegador Web Moderno:** Google Chrome, Mozilla Firefox, Microsoft Edge, etc.
* 🐙 **Git:** Necessário para clonar o repositório do GitHub.
    * Repositório: [https://github.com/PeresDev01/EducaSenai](https://github.com/PeresDev01/EducaSenai)

---

## 🛠️ Como Executar Localmente

Siga os passos abaixo para rodar o frontend em sua máquina:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/PeresDev01/EducaSenai.git](https://github.com/PeresDev01/EducaSenai.git)
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd EducaSenai 
    # Ou o nome da pasta onde o frontend foi clonado
    ```

3.  **Abra o arquivo principal:**
    * Você pode abrir o arquivo `index.html` da pasta `TelaInicial/` diretamente no seu navegador.
    * **Recomendado:** Utilize um servidor local para evitar possíveis problemas com CORS ao fazer requisições para a API e para simular um ambiente mais realista:
        * **Opção 1 (Python):** Se você tem Python instalado, execute no terminal, dentro da pasta do projeto:
            ```bash
            # Para Python 3.x
            python -m http.server 
            # Ou para Python 2.x
            # python -m SimpleHTTPServer
            ```
            Depois acesse `http://localhost:8000` (ou a porta indicada) no navegador.
        * **Opção 2 (VS Code Live Server):** Se utiliza o Visual Studio Code, instale a extensão "Live Server". Clique com o botão direito no arquivo `index.html` desejado e selecione "Open with Live Server".

4.  **Backend Ativo:**
    * ❗️ **Importante:** O frontend precisa da API backend para funcionar (login, carregar dados, etc.). Certifique-se de que o servidor backend esteja rodando, seja localmente ou na nuvem (`https://educasenai-api.onrender.com`).

---

## 📸 Screenshots

Abaixo estão as capturas de tela das principais interfaces do EducaSenai, organizadas por perfil de usuário.

### 👨‍🎓 Visão do Aluno

<p align="center">
  <strong>1. Tela de Login (Aluno)</strong><br>
  <em>Interface de acesso dedicada aos alunos.</em><br>
  <img src="./screenshots/TelaLoginAluno.png" alt="Tela de Login - Aluno" width="70%"/>
</p>
<br>

<p align="center">
  <strong>2. Dashboard Principal (Aluno)</strong><br>
  <em>Visão geral dos cursos, ofensivas, feedbacks e agendamentos.</em><br>
  <img src="./screenshots/DashBoardAluno.png" alt="Dashboard Principal - Aluno" width="70%"/>
</p>
<br>

<p align="center">
  <strong>3. Agendamento de Reunião (Aluno)</strong><br>
  <em>Formulário e calendário para solicitar encontros com mentores.</em><br>
  <img src="./screenshots/AgendarReuniaoAluno.png" alt="Tela de Agendamento de Reunião - Aluno" width="70%"/>
</p>
<br>

<p align="center">
  <strong>4. Tela de Feedbacks (Aluno)</strong><br>
  <em>Lista de feedbacks recebidos dos mentores.</em><br>
  <img src="./screenshots/FeedbackAluno.png" alt="Tela de Feedbacks - Aluno" width="70%"/>
</p>
<br>

---

### 👨‍🏫 Visão do Mentor

<p align="center">
  <strong>1. Tela de Login (Mentor)</strong><br>
  <em>Interface de acesso dedicada aos mentores.</em><br>
  <img src="./screenshots/TelaLoginMentor.png" alt="Tela de Login - Mentor" width="70%"/>
</p>
<br>

<p align="center">
  <strong>2. Dashboard Principal (Mentor)</strong><br>
  <em>Painel para gerenciamento de alunos, feedbacks e reuniões.</em><br>
  <img src="./screenshots/DashBoardMentor.png" alt="Dashboard Principal - Mentor" width="70%"/>
</p>
<br>

<p align="center">
  <strong>3. Gerenciamento de Reuniões (Mentor)</strong><br>
  <em>Tela para aprovar, recusar e visualizar solicitações de reunião.</em><br>
  <img src="./screenshots/ReunioesMentor.png" alt="Tela de Gerenciamento de Reuniões - Mentor" width="70%"/>
</p>
<br>

<p align="center">
  <strong>4. Envio de Feedback (Mentor)</strong><br>
  <em>Interface para enviar feedbacks aos alunos.</em><br>
  <img src="./screenshots/FeedbackMentor.png" alt="Tela de Envio de Feedback - Mentor" width="70%"/>
</p>

---

## 🔗 Conexão com o Backend

O frontend interage com a API RESTful do EducaSenai, hospedada em:

[`https://educasenai-api.onrender.com`](https://educasenai-api.onrender.com)

A autenticação é realizada via **Token JWT**. Após o login bem-sucedido, o token é armazenado no `sessionStorage` e enviado no cabeçalho `Authorization: Bearer <token>` de todas as requisições subsequentes para endpoints protegidos.

* **Repositório do Backend:** [`https://github.com/DevJulioo/BackEndTCC`](https://github.com/DevJulioo/BackEndTCC)

---

## 📁 Estrutura de Pastas (Visão Geral)

```plaintext
/EducaSenai/                 # Pasta raiz do projeto clonado
├── TelaInicial/             # Landing Page/Página Inicial Pública
├── Login Principal/         # Tela de Login do Aluno
├── Login Professor/         # Tela de Login do Mentor
├── Cadastro/                # Fluxo de Cadastro do Aluno (múltiplas telas)
├── telaprincipal/           # Dashboard Principal do Aluno
│   ├── MeusFeedbacks/       # Tela de Feedbacks do Aluno
│   ├── Reunioes/            # Tela de Agendamento/Visualização de Reuniões (Aluno)
│   └── ...                  # Outras seções do Aluno
├── Tela inicial Mentor/     # Dashboard Principal do Mentor
│   ├── Alunos/              # Seção de Gerenciamento de Alunos (Mentor)
│   ├── Feedback/            # Seção de Envio/Visualização de Feedbacks (Mentor)
│   ├── Reunioes/            # Seção de Gerenciamento de Reuniões (Mentor)
│   └── ...                  # Outras seções do Mentor
├── UserScreen/              # Tela de Perfil do Usuário (comum ou separada?)
├── IOT/                     # Módulo de Conteúdo: Internet das Coisas
│   ├── Trilha de aprendizado IOT/
│   └── Aula01IOT/
│       ├── TabelaConteudo/
│       ├── Introdução video/
│       └── ...              # Outras aulas/exercícios de IOT
├── SOP/                     # Módulo de Conteúdo: Sistemas Operacionais
├── LEV/                     # Módulo de Conteúdo: Levantamento de Requisitos
├── FRONT/                   # Módulo de Conteúdo: Frontend
├── BANCO/                   # Módulo de Conteúdo: Banco de Dados
├── BACK/                    # Módulo de Conteúdo: Backend
├── img/                     # Pasta para imagens globais (logos, ícones comuns)
├── css/                     # Arquivos CSS globais (se houver)
├── js/                      # Arquivos JS globais (se houver)
└── README.md                # Este arquivo de documentação
