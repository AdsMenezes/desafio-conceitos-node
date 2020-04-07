const express = require("express");
const cors = require("cors");
const { uuid } =  require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/* Retorna repositórios */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/* Cria novo repositório */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repository);

  return response.status(201).json(repository);
});

/* Altera repositório */
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'})
  }

  const repository = { 
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

/* Deleta repositório */
app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not fount'});
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

/* Dar like no repositório */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not fount'});
  }

  const like = repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return response.json({ likes: like });
});

module.exports = app;
