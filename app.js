const express = require("express");
const queue = require("express-queue");
const morgan = require("morgan");
const cors = require("cors");
// const expressQueue = require('');

const app = express();

// const queueMw= queue({ activeLimit: 2, queuedLimit: -1 })
// const queueMw = queue({
//   activeLimit: 2,
//   queuedLimit: 5,
//   maxJournalLength: 4,
//   rejectHandler: (req, res) => {
//     res.status(429).send("Too many requests, please try again later.");
//   },
// });

const queueMw = queue({
  activeLimit: 2,
  queuedLimit: 6,
  maxJournalLength: 4,
  rejectHandler: (req, res) => {
    return res
      .status(429)
      .send(
        "Demasiadas solicitudes, hasta aqui llego el balanceador  de carga mamo 😔👌"
      );
  },
});
const PORT = process.env.PORT || 3000;

// app.use(morgan("dev"));
app.use(queueMw);
app.use(cors());

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const responseDelay = 5000;
let counter = 0;

app.get("/test2", (req, res) => {
  res.send("test2");
});

app.get("/test1", (req, res) => {
  let cnt = counter++;
  //   console.log(`Request ${cnt} started at ${new Date().toISOString()}`);
  console.log(`Request ${cnt} started at ${new Date().toLocaleString()}`);

  console.log(
    `get /test1: [${cnt}/request] queuelength: ${queueMw.queue.getLength()}`
  );
  const result = {
    message: `Peticion ${cnt} enviada, estabas en la cola ${queueMw.queue.getLength()}`,
  };
  //    queueMw.queue.

  setTimeout(function () {
    console.log(
      `get(test1): [${cnt}/ready] queueLength: ${queueMw.queue.getLength()}`
    );
    res.status(200).json(result);
    console.log(
      `get(test1): [${cnt}/sent] queueLength: ${queueMw.queue.getLength()}`
    );
    console.log(`Request ${cnt} finished at ${new Date().toLocaleString()}`);
  }, responseDelay);

  //   console.log("test1");

  //   res.send("test1");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

// console.log(`queueLength: ${queueMw.queue.getLength()}`);

app.listen(PORT, () =>
  console.log(`Example app listening on port  http://localhost:${PORT}`)
);
