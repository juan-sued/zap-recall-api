# zap-recall-api

# 1 - Instale as dependências utilizando a versão 20.10 ou superior do node  
*npm install*

# 2 - Configure o banco de dados. 
Vá no seu monitor de banco postgree e crie 3 bancos de dados:
*zap_recall_db* => Para produção
*zap_recall_db_development* => Para desenvolvimento
*zap_recall_db_test* => Para testes

# 3 - configure a senha no respectivo arquivo .env baseando-se no .env.example
crie um arquivo *zap_recall_db* , *.env.development* e um chamado *zap_recall_db_test*;
baseando-se no .env.example, configure o arquivo com os dados do respectivo banco criado no passo 2

# 4 - Criação das tabelas
Digite npx ntl no terminal e navegue até a opção *dev:migration:generate*.
Agora seu banco possui as tabelas.

# 5 - Seed de dados
Digite npx ntl e selecione a opção dev:seed
Se tudo ocorrer bem, ele deve ter criado uma massa de testes para cada entidade.

# OBS - Para teste e produção seguir os passos 4 e 5, porém selecionando test: e prod: nas opções do ntl.

# 6 - Verifique o ambientes rodando os testes.

Digite *npx ntl* e navegue até a opção *dev* ou digite *npm run dev* para iniciar o projeto.

rode os testes para verificar a integridade do projeto. *npx ntl* e *test:watch*.


