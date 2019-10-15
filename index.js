const express = require('express');

const server = express();
server.use(express.json());

let projects = [];
let numberOfRequests = 0;

function countRequests(request, response, next) {
  numberOfRequests++;
  console.log(`The app received ${numberOfRequests} requests so far.`);
  return next();
}

function checkProjectExists(request, response, next) {
  const { id } = request.params;

  if(!projects.find((project) => project["id"] === id)) {
    return response.status(400).json({ error: "Project not found" });
  }
  return next();
}

server.get('/projects', countRequests, (request, response) => {
  return response.json(projects);
});

server.post('/projects', countRequests, (request, response) => {
  const { id, title, tasks } = request.body;
  projects.push({ id, title, tasks });
  return response.json(projects);
});

server.delete('/projects/:id', countRequests, checkProjectExists, (request, response) => {
  const { id } = request.params;
  projects = projects.filter((project) => project["id"] !== id);
  return response.json(projects);
});

server.put('/projects/:id', countRequests, checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title, tasks } = request.body;
  projects.map((project) => {
    if(project["id"] === id) {
      project.title = title;
      project.tasks = tasks;
    }
    return project;
  });

  return response.json(projects);
});

server.post('/projects/:id/tasks', countRequests, checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { tasks } = request.body;

  projects.map((project) => project["id"] === id ? project.tasks = tasks : project);
  return response.json(projects);
});

server.listen(3333);