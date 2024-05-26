const mongoose = require('mongoose');
const {MONGO_URL} = require('./config');
process.on('uncaughtException', err => {
    console.log("err: ", err)
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    process.exit(1);
})

const app = require('./app');

// Database connection
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

  const port = 3000;

  const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
  
  process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });