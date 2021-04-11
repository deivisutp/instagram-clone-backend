# Photogram backend

## Demo 📸

<div align="center" >
  <img src="./github/photogram.gif" alt="demo-web" height="425">
</div>

Photogram features:

Frontend:
- React Js — A JavaScript library for building user interfaces;
- Styled-components;
- React context;
- React hooks;

Backend:
- Node Js — A web framework for Js;
- Postgres — A cross-platform and open-source document-oriented database;
- ORM Sequelize; 
- Redis — A platform for caching;
- Express - To build our api;
- JWT — A library for authentication of users;
- bcryptjs - To encrypt the sensive information;
- Amazon S3 - To store our files and photos;

Frontend and Backend are hosted on Heroku and you can use the app:
https://regional-photogram-front.herokuapp.com/

--
Getting started with the backend server:
https://github.com/deivisutp/instagram-clone-backend

Open Redis server
Move yourself to the backend folder: cd backend
Copy the .env.example file and create a .env file and add the connection BD and other and SIGNATURE (can be any word)
Install sequelize-cli how dev-dependency and execute this yarn sequelize db:create next yarn sequelize db:migrate
Run yarn dev to start the server

Getting started with the frontend app:
https://github.com/deivisutp/instagram-clone-frontend

Move yourself to the frontend folder: cd web
Copy the .env.example file and create a .env and cofing you fields
Run yarn start to start the web application
