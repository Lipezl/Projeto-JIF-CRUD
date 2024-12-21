# Projeto JIF CRUD

## Descrição
🎓✨📚 Este é um projeto desenvolvido para a matéria de **Programação para Web** no curso **Técnico em Informática**. O objetivo do projeto é implementar um sistema web para o gerenciamento de dados relacionados aos Jogos dos Institutos Federais (JIF), utilizando um CRUD (Create, Read, Update, Delete). 🎓✨📚

O sistema permite o cadastro, consulta, edição e exclusão de informações como:
- Atletas
- Campus
- Comissão organizadora
- Coordenação
- Usuários

## Tecnologias Utilizadas
🖥️⚙️🌐
- **Node.js**: Para o servidor backend.
- **Express.js**: Framework para criação de rotas e organização do servidor.
- **EJS**: Motor de templates para renderização de páginas dinâmicas.
- **Bootstrap**: Para estilização e design responsivo.
- **MySQL**: Banco de dados relacional utilizado para armazenar os dados do sistema. 🖥️⚙️🌐

## Estrutura do Projeto
📂🗂️🏗️ Abaixo está a organização principal dos arquivos do projeto: 📂🗂️🏗️

```
Projeto-JIF-CRUD/
├── controllers/        # Controladores para cada funcionalidade do sistema
├── db/                 # Configuração de banco de dados e arquivos SQL
├── public/             # Arquivos estáticos (CSS, JS, imagens)
├── views/              # Páginas EJS para renderização no front-end
├── .env.example        # Exemplo de variáveis de ambiente
├── index.js            # Arquivo principal para inicialização do servidor
├── package.json        # Configurações do projeto e dependências
└── README.md           # Documentação do projeto
```

### Pastas principais
📁✏️🛠️
- **controllers/**: Contém a lógica de negócio para gerenciar as requisições e respostas do servidor.
- **db/**: Inclui o arquivo de conexão ao banco de dados e dumps SQL para criar as tabelas e popular dados iniciais.
- **public/**: Arquivos estáticos como estilos (CSS), scripts (JS) e imagens.
- **views/**: Templates EJS para renderizar as interfaces do sistema. 📁✏️🛠️

## Configuração e Execução
🔧⚙️🚀

### Requisitos
📦✅🌍 Certifique-se de ter instalado: 📦✅🌍
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Passos para Configurar o Projeto
1. **Clonar o repositório**:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd Projeto-JIF-CRUD
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Configurar o banco de dados**:
   - Crie um banco de dados MySQL.
   - Importe os arquivos SQL localizados na pasta `db/dump_jif/` para configurar as tabelas.

4. **Configurar variáveis de ambiente**:
   - Renomeie o arquivo `.env.example` para `.env`.
   - Configure as variáveis de ambiente (como credenciais do banco de dados).

5. **Iniciar o servidor**:
   ```bash
   npm start
   ```

6. **Acessar o sistema**:
   Abra o navegador e acesse: [http://localhost:3000](http://localhost:3000)

## Funcionalidades
📝📊🔒
- **CRUD de atletas**: Cadastro, consulta, edição e exclusão de atletas.
- **Gerenciamento de campus**: Administração das informações dos campus participantes.
- **Coordenação e comissão**: Controle de usuários com diferentes níveis de acesso. 📝📊🔒

## Licença
📜📚⚖️ Este projeto foi desenvolvido para fins educacionais e não é destinado para produção comercial. 📜📚⚖️

