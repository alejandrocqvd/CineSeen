# CineSeen

A database used for keeping track of your favourite directors and their movies, all in once place. 

## Installation

Download files in the repository and ensure you have all the necessary libraries installed. Ensure you have [MongoDB](https://www.mongodb.com/try/download/community) installed.

```bash
npm i express ejs express-ejs-layouts
npm i --save-dev nodemon
npm i body-parser
npm i method-override
```

## Usage
Create a .env file in the main directory with the following information:
```bash
DATABASE_URL=mongodb://localhost/cineseen
PORT=YOUR_PORT_OF_CHOICE

```

Then, with everything set up properly, use the following command to fire up the sever on: localhost:YOUR_PORT_OF_CHOICE

```bash
npm run devStart
```
