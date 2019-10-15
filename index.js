const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
let numberOfRequests = 0;

// Middlewares
function countRequests(request, response, next) {
  numberOfRequests++;
  console.log(`The app received ${numberOfRequests} requests so far.`);
  return next();
}

function checkProjectExists(request, response, next) {
  const { id } = request.params;

  if(!projects.find((project) => project.id == id)) {
    return response.status(400).json({ error: "Project not found" });
  }
  return next();
}

// Projects
server.get('/projects', countRequests, (request, response) => {
  return response.json(projects);
});

server.post('/projects', countRequests, (request, response) => {
  const { id, title } = request.body;

  projects.push({ id, title, tasks: [] });
  return response.json(projects);
});

server.delete('/projects/:id', countRequests, checkProjectExists, (request, response) => {
  const { id } = request.params;

  projectIndex = projects.findIndex((project) => project.id == id);
  projects.splice(projectIndex, 1);

  return response.json(projects);
});

server.put('/projects/:id', countRequests, checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  project = projects.find((project) => project.id == id);
  project.title = title;

  return response.json(projects);
});

// Tasks
server.post('/projects/:id/tasks', countRequests, checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { tasks } = request.body;

  project = projects.find((project) => project.id == id);
  project.tasks = tasks;

  return response.json(projects);
});

server.listen(3333);