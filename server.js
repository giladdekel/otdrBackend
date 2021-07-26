const express = require("express");

const app = express();

const axios = require("axios");

// const nodemailer = require("nodemailer");

// const transporter = require("./config/mail.conf");

require("dotenv").config();

const log4js = require("log4js");

const http = require("http");

const { Server } = require("socket.io");

/////////////////////////// socket.io send to client
const httpServer = http.Server(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// const notifier = require("node-notifier");

const path = require("path");

////////////////

// log4js.configure({
//   appenders: { cheese: { type: "file", filename: "cheese.log" } },
//   categories: { default: { appenders: ["cheese"], level: "trace" } }
// });

log4js.configure({
  appenders: {
    everything: { type: "dateFile", filename: "./logs/all-the-logs.log" },
  },
  categories: {
    default: { appenders: ["everything"], level: "trace" },
  },
});

const logger = log4js.getLogger("all-the-logs");
// logger.trace("Entering cheese testing");
// logger.debug("Got cheese.");
// logger.info("Cheese is Comté.");
// logger.warn("Cheese is quite smelly.");
// logger.error("Cheese is too ripe!");
// logger.fatal("Cheese was breeding ground for listeria.");

// const mongoose = require('mongoose')

// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
// const db = mongoose.connection
// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('Connected to Database'))

app.use(express.json());

// const subscribersRouter = require('./routes/subscribers')
// app.use('/subscribers', subscribersRouter)

let failedFirstTime = true;

let successFirstTime = true;

// const ip = "172.50.30.200";

const ip = "20.135.100.41";

let length = 0;

// let lengthFailed = 1;

let originLength = 225;

let name = "otderTest";

let prevFailureLength = -1;
///////////////////start/////////////////////////

console.log(
  "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
);

logger.trace("\n\n\n\n\n\n\n");

logger.trace("Entering OTDR testing");

/////////////// socket.io on connection     ///////////////
io.on("connection", (socket) => {
  console.log(
    "///////////////////////connection///////////////////////",
    socket.id
  );

  socket.on("muteVolume", () => {
    // console.log("emit muteVolume");
    io.local.emit("onVolumeMute");
  });
});

////////send email
// async function sendToMail(from, to, subject, text, html) {
//   let info = await transporter.sendMail({
//     from: from, // sender address
//     to: to, // list of receivers
//     subject: subject, // Subject line
//     text: text, // plain text body
//     html: html, // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

async function getLength() {
  try {
    // const response = await axios.get('http://172.50.30.200/api/v1/monitoring/tests');

    const response = await axios.get(
      `http://${ip}/api/v1/monitoring?fields=state,tests.items.id,tests.items.name,tests.items.otdrId,tests.items.otauPorts,tests.items.period,tests.items.state,tests.items.thresholds.*,tests.items.reference.*,tests.items,tests.items.lastFailed.*,tests.items.lastPassed.*`
    );

    // const responseHtml = await axios.get(
    //   `http://20.135.100.41/api/v1/monitoring/tests/3e8e3509-556f-4bb1-8668-af65dcddf9a7/references/current/report`
    // );
    // console.log("responseHtml:", JSON.stringify(responseHtml));

    // const response = await axios.get(
    //   `http://172.50.30.200/api/v1/monitoring?fields=state,tests.items.id,tests.items.name,tests.items.otdrId,tests.items.otauPorts,tests.items.period,tests.items.state,tests.items.thresholds.*,tests.items.reference.*,tests.items,tests.items.lastFailed.*,tests.items.lastPassed.*`
    // );

    // const response = await axios.get('http://172.50.30.200/api/v1/monitoring/tests/1a7b9bba-599e-4608-bd8f-ac153c8ec52f/references/current/report');

    //  const response = await axios.get('http://172.50.30.200/#/viewer?traces=%2Fapi%2Fv1%2Fmonitoring%2Ftests%2F1a7b9bba-599e-4608-bd8f-ac153c8ec52f%2Fcompleted%2Flast_passed%2Ftraces%3Ftrace_naming%3Dextended&linkmap=%2Fapi%2Fv1%2Fmonitoring%2Ftests%2F1a7b9bba-599e-4608-bd8f-ac153c8ec52f%2Fcompleted%2Flast_passed%2Flinkmap&reftraces=%2Fapi%2Fv1%2Fmonitoring%2Ftests%2F1a7b9bba-599e-4608-bd8f-ac153c8ec52f%2Freferences%2Fcurrent%2Ftraces%3Ftrace_naming%3Dextended');

    // console.log("report: ", response.data);

    // //length

    // //time

    if (response) {
      var timeFailed = response.data.tests.items[0].lastFailed.started;

      var timeStarted = response.data.tests.items[0].lastPassed.started;

      // console.log("timeFailed: ",timeFailed);

      // console.log("timeStarted: ",timeStarted);

      //if failed recently

      if (timeFailed > timeStarted) {
        if (
          response.data.tests.items[0].lastFailed.extendedResult === "no_fiber"
        ) {
          length = 0;

          io.local.emit("onFiberChange", {
            length: length,
            time: timeFailed,
            type: "noFiber",
          });
          // io.local.emit("onFailure", {
          //   length: length,
          //   time: timeFailed,
          //   type: "failure",
          // });
        } else {
          length =
            response.data.tests.items[0].lastFailed.traceChange.changeLocation;

          length = Number((length * 1000).toFixed(2));
        }

        if (length !== prevFailureLength) {
          failedFirstTime = true;
        }
        prevFailureLength = length;

        if (failedFirstTime) {
          console.log("timeFailed: ", timeFailed);

          console.log("lengthFailed: ", length);

          successFirstTime = true;
          failedFirstTime = false;

          ////logger file

          logger.warn(`length of failure: ${length}`);

          /////////// socket io send to client

          io.local.emit("onFiberChange", {
            length: length,
            time: timeFailed,
            type: "faliure",
          });
          console.log(
            'io.local.emit("onFiberChange", { length: length, type: "faliure" });'
          );

          // io.local.emit("onFailure", {
          //   length: length,
          //   time: timeFailed,
          //   type: "failure",
          // });
          // console.log('io.local.emit("onFailure")');

          // ///////////send to mail
          // let from = '"R.S" <giladdekel123@gmail.com>'; // sender address
          // let to = "giladd@rs-traffic.com, giladdekel123@gmail.com"; // list of receivers
          // let subject = "OTDR fail"; // Subject line
          // let text = "OTDR fail"; // plain text body
          // let html = `<b>OTDR fail at ${length} meter</b>`; // html body

          // // sendToMail(from, to, subject, text, html);

          ////////////////////////          // // /// send the data to the GIS Programe

          async function sendToGIS() {
            try {
              const response = await axios.get(
                `http://modybu-pc:6080/arcgis/rest/services/FindLocationByDistance/GPServer/Find%20Location%20By%20Distance/submitJob?dist=${length},name=${name}`
              );
              console.log(response);
            } catch (error) {
              console.error("error in sendToGIS:", error);
            }
          }

          // sendToGIS();
        }
      } else {
        if (successFirstTime) {
          console.log("timeStarted: ", timeStarted);
          length = originLength;
          console.log("lengthSuccess: ", length);

          successFirstTime = false;
          failedFirstTime = true;

          /////logger file succsess:

          logger.info(`length of success: ${length} meter`);

          /////////// socket io send to client
          io.local.emit("onFiberChange", {
            length: length,
            time: timeStarted,
            type: "success",
          });
          console.log(
            'io.local.emit("onFiberChange", { length: length, type: "success" });'
          );

          // io.local.emit("onSuccess", {
          //   length: length,
          //   time: timeStarted,
          //   type: "success",
          // });
        }
      }
    }
  } catch (error) {
    failedFirstTime = true;
    successFirstTime=true;
    console.log("failedFirstTime:", failedFirstTime);

    io.local.emit("onError", error);

    // let from = '"R.S" <giladdekel123@gmail.com>'; // sender address
    // let to = "giladd@rs-traffic.com, giladdekel123@gmail.com"; // list of receivers
    // let subject = "OTDR error"; // Subject line
    // let text = "OTDR error"; // plain text body
    // let html = `<b>OTDR error:  ${error} </b>`; // html body

    // sendToMail(from, to, subject, text, html);

    console.error("error in request:", error);

    logger.error(`error in request: ${error}`);
  }
}

// function sendFailNote() {
//   notifier.notify(
//     {
//       title: "OTDR Faliure",
//       message: `length of failure: ${length || 0}`,
//       sound: true, // Only Notification Center or Windows Toasters
//       wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
//     })
// }

setInterval(() => {
  getLength();
}, 5000);

/////////////end/////////////////////////////////

// ////////////////////start  try 1 with digest-fetch

// const DigestFetch = require('digest-fetch');

// const client = new DigestFetch('rtuaqdmin', '*10238~');

// const url = 'http://172.50.30.200/api/v1/monitoring/tests'
// const options = {
//      headers: {
//         'Content-Type': 'application/json',
//     }}

// client.fetch(url, options)
//   .then(resp=>resp.json())
//   .then(data=>console.log(data))
//   .catch(e=>console.error(e))

// ////////////////////  end try 1 with digest-fetch

// app.listen(5000, () => console.log("Server Started"));

const port = process.env.PORT || 5000;

// httpServer.listen(port, () => {
//   console.log(`Serve at http://localhost:${port}`);
// });

httpServer.listen(5000, "0.0.0.0", function () {
  console.log("listening on *:5000");
});
