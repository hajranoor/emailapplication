const express = require("express");
const cors = require("cors");
const http = require("http");
var Imap = require("imap");
var MailParser = require("mailparser").MailParser;
var Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
Promise.longStackTraces();
// const app = express();
const app = express();  
app.use(cors());
const server = http.createServer(app);

var imapConfig = {
  user: "user@gmail.com",
  password: "yourpassword",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },


};

let messageCounter = 1;
const messages = [];
const sentMessages = []
const draftMessages = []

var imap = new Imap(imapConfig);
Promise.promisifyAll(imap);

imap.once("ready", execute);
imap.once("error", function (err) {
  console.log("Connection error:  " + err.stack);
});

imap.connect();


var sentimap = new Imap(imapConfig);
Promise.promisifyAll(sentimap);

sentimap.once("ready", sentExecute);
sentimap.once("error", function (err) {
  console.log("Connection error:  " + err.stack);
});

sentimap.connect();



function execute() {
  imap.openBox("INBOX", false, function (err, mailBox) {
    if (err) {
      console.error(err);
      return;
    }
    var f = imap.seq.fetch("1:*", { bodies: "", reverse: true }); // Fetch all messages
    var messageCount = 0;

    f.on("message", function (msg, seqno) {
      messageCount++;

      processMessage(msg, seqno, function (message) {

        messages.push(message);
      });
    });

    f.once("error", function (err) {
      console.error(err);
    });
  });
}

function sentExecute() {
  sentimap.openBox("[Gmail]/Sent Mail", false, function (err, mailBox) {
    if (err) {
      console.error(err);
      return;
    }
    var f = sentimap.seq.fetch("1:*", { bodies: "", reverse: true }); // Fetch all messages
    var messageCount = 0;

    f.on("message", function (msg, seqno) {
      messageCount++;

      processSentMessage(msg, seqno, function (message) {
        
        sentMessages.push(message);
      });
    });

    f.once("error", function (err) {
      console.error(err);
    });
  });
}



















function processMessage(msg, seqno, callback) {
  console.log("processing msg #" + seqno);

  var parser = new MailParser();
  var headers = null;
  var body = "";
  var message = {};
  var base64String = "";

  parser.on("headers", function (parsedHeaders) {
    headers = parsedHeaders;

  });
  var texta = "";

  parser.on("data", (data) => {

    


    if (data.type == "attachment" ) {
      texta = data.text;

      

      var attachment = {
        filename: data.filename,
        contentType: data.contentType,
        content: data.content,
      };

      const dataChunks = [];
      const writableStream = new Readable({
        read() {},
      });

      const streamHash = attachment.content;

      streamHash.on("data", (chunk) => {
        dataChunks.push(chunk);
      });

      streamHash.on("end", () => {
        const dataBuffer = Buffer.concat(dataChunks);

        base64String = dataBuffer.toString("base64");

        var finalAttachment = {
          filename: attachment.filename,
          contentType: attachment.contentType,
          content: base64String,
        };

        var finalFrom = headers.get("from");

        message = {
          id: seqno,
          body: data.text,
          subject: headers.get("subject"),
          date: headers.get("date"),
          fromAddress: finalFrom.value[0].address,
          fromName: finalFrom.value[0].name,
          attachment: finalAttachment,
        };
        
        callback(message);


        streamHash.on("error", (error) => {
          console.log("error reading streamhash", error);
        });
      });

      

      body += data.text;
    }


    else if  (data.type == "text") {
      texta = data.text;

      var finalFrom = headers.get("from");

        message = {
          id: seqno,
          body: data.text,
          subject: headers.get("subject"),
          date: headers.get("date"),
          fromAddress: finalFrom.value[0].address,
          fromName: finalFrom.value[0].name,
        };

        callback(message)


    }


  });


  msg.on("body", function (stream) {
    stream.on("data", function (chunk) {
      parser.write(chunk.toString("utf8"));
    });
  });

  msg.once("end", function () {
    parser.end();
    
  });
}





function processSentMessage(msg, seqno, callback) {
  console.log("processing msg #" + seqno);

  var parser = new MailParser();
  var headers = null;
  var body = "";
  var message = {};
  var base64String = "";

  parser.on("headers", function (parsedHeaders) {
    headers = parsedHeaders;

  });
  var texta = "";

  parser.on("data", (data) => {

    


    if (data.type == "attachment" ) {
      texta = data.text;

      

      var attachment = {
        filename: data.filename,
        contentType: data.contentType,
        content: data.content,
      };

      const dataChunks = [];
      const writableStream = new Readable({
        read() {},
      });

      const streamHash = attachment.content;

      streamHash.on("data", (chunk) => {
        dataChunks.push(chunk);
      });

      streamHash.on("end", () => {
        const dataBuffer = Buffer.concat(dataChunks);

        base64String = dataBuffer.toString("base64");

        var finalAttachment = {
          filename: attachment.filename,
          contentType: attachment.contentType,
          content: base64String,
        };

        var finalFrom = headers.get("from");

        message = {
          id: seqno,
          body: data.text,
          subject: headers.get("subject"),
          date: headers.get("date"),
          fromAddress: finalFrom.value[0].address,
          fromName: finalFrom.value[0].name,
          attachment: finalAttachment,
        };
        
        callback(message);


        streamHash.on("error", (error) => {
          console.log("error reading streamhash", error);
        });
      });

      

      body += data.text;
    }


    else if  (data.type == "text") {
      texta = data.text;

      var finalFrom = headers.get("from");

        message = {
          id: seqno,
          body: data.text,
          subject: headers.get("subject"),
          date: headers.get("date"),
          fromAddress: finalFrom.value[0].address,
          fromName: finalFrom.value[0].name,
        };

        callback(message)


    }


  });


  msg.on("body", function (stream) {
    stream.on("data", function (chunk) {
      parser.write(chunk.toString("utf8"));
    });
  });

  msg.once("end", function () {
    parser.end();
    
  });
}























const port = 3001;

const dataArray = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30,
];
anotherArray = [];
anotherSentArray = []
anotherDraftArray = []

app.get("/getInboxMsgs", (req, res) => {
  const currentPage = req.query.page;
  const chunkSize = 3;
  const startIndex = (currentPage - 1) * chunkSize;
  const endIndex = currentPage * chunkSize;
  console.log("current page in backend", currentPage);
  console.log("start and end index", startIndex, endIndex);

  if (
    startIndex >= 0 &&
    startIndex < dataArray.length &&
    endIndex <= dataArray.length
  ) {
    anotherArray = messages.slice(startIndex, endIndex);
    res.json(anotherArray);
  } else if (endIndex > dataArray.length) {
    console.log("index out of bounds");
  }

});


app.get("/getSentMsgs", (req, res) => {
  const currentPage = req.query.page;
  const chunkSize = 3;
  const startIndex = (currentPage - 1) * chunkSize;
  const endIndex = currentPage * chunkSize;
  console.log("current page in backend", currentPage);
  console.log("start and end index", startIndex, endIndex);

  if (
    startIndex >= 0 &&
    startIndex < dataArray.length &&
    endIndex <= dataArray.length
  ) {
    anotherSentArray = sentMessages.slice(startIndex, endIndex);
    res.json(anotherSentArray);
  } else if (endIndex > dataArray.length) {
    console.log("index out of bounds");
  }

});

app.get("/getDraftMessages", (req, res) => {
  const currentPage = req.query.page;
  const chunkSize = 3;
  const startIndex = (currentPage - 1) * chunkSize;
  const endIndex = currentPage * chunkSize;
  console.log("current page in backend", currentPage);
  console.log("start and end index", startIndex, endIndex);

  if (
    startIndex >= 0 &&
    startIndex < dataArray.length &&
    endIndex <= dataArray.length
  ) {
    anotherDraftArray = draftMessages.slice(startIndex, endIndex);
    res.json(anotherDraftArray);
  } else if (endIndex > dataArray.length) {
    console.log("index out of bounds");
  }

});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});