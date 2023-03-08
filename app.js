const express = require('express');
const helmet = require("helmet");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const sauceRoutes = require('./routes/sauceRoute');
const userRoutes = require('./routes/userRoute');
const path = require('path');
const app = express();
const MY_PORT = process.env.PORT;
const MY_APP_SECRET = process.env.APP_SECRET;

//Autorisation d'image
mongoose.set('strictQuery', true);
app.use(express.json());
app.use(helmet.contentSecurityPolicy({ directives: { "img-src": ["'self'"] } }));

// Connection à Mongoose
mongoose.connect('mongodb+srv://UberId:Terrine59@cluster0.zqjkexv.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS = sécuriter
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get("/", (req, res) => {
  return res.send(MY_APP_SECRET);
});
app.listen(MY_PORT, () => console.log(`Server running on port ${MY_PORT}`));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
