require('dotenv').config();
const port = process.env.PORT || 3000;

const express = require('express'),
  path = require('path'),
  cors = require('cors'),
  app = express(),
  publicPath = path.join(__dirname, '../', '__client-app-build'),
  { connect } = require('mongoose'),
  fileUpload = require('express-fileupload');

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.static(publicPath));
app.use(fileUpload());
app.use(express.json());

const { authorizationMiddleware } = require('./controllers/auth-controller');
const authRoutes = require('./routes/auth-routes');
const fileRoutes = require('./routes/file-routes');
const userRoutes = require('./routes/user-routes');
const bookmarkRoutes = require('./routes/bookmark-routes');

app.use('/api/auth', authRoutes);
app.use('/api/user', authorizationMiddleware, userRoutes);
app.use('/api/file', authorizationMiddleware, fileRoutes);
app.use('/api/bookmark', authorizationMiddleware, bookmarkRoutes);

//SPA
app.use('/', (req, res) => {
  console.log('/', req.url);
  res.sendFile(path.join(publicPath, 'index.html'));
});

//ERROR HANDLING
const { erorHandler } = require('./controllers/error-controller');
app.use(erorHandler);

//START SERVER
app.listen(port, () => {
  console.info('****************************************');
  console.log(`*  Server listening on port ${port}`);
  connectMongoDB();
});

function connectMongoDB() {
  connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
    .then(() => {
      console.info('*  MongoDB successfully connected      *');
    })
    .catch((err) => {
      console.error('(!) Error al conectar con MongoDB', err);
    })
    .finally(() => {
      console.info('****************************************');
    });
}
