const express = require('express');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();

hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set('view-engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log.');
    }
  });
  next();
});
// middleware to stop everything below
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });
// middleware to read static content
app.use(express.static(path.join(__dirname, '/public')));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMsg: 'Welcome to my website',
  });
  // res.send({
  //   name: 'Victor',
  //   likes: [
  //     'Biking',
  //     'Cities',
  //   ],
  // });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    // currentYear: new Date().getFullYear(), // we removed this thanks to our helper getCurrentYear
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to fulfill the request',
  });
});

app.disable('etag');
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
