require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

const express = require('express');
const app = express();

//connectDB
const connectDB = require('./db/connect')

const authenticateUser = require('./middleware/authentication')

//routers
const authRouter = require('./routes/auth')
const transactionsRouter = require('./routes/transactions')
const goalsRouter = require('./routes/goals');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('public'));

app.set('trust proxy', 1)
app.use(
  rateLimit({
    windowMS: 15*60*1000, //15 minutes
    max: 100, //limit each IP to 100 requests per windowMS
  })
);

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/transactions', authenticateUser, transactionsRouter);
app.use('/api/v1/goals', authenticateUser, goalsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
