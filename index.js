const express = require('express');


// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world (again)!'}
];


// defining an endpoint to return all ads
app.get('/test', (req, res) => {
  res.send(ads);
});

// starting the server
app.listen(3000, () => {
  console.log('listeningg on port 3000');
});