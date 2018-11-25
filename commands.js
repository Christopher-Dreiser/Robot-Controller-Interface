let logger = require("winston");

//Code previously in test.html
let direction, intervalId, timer = 500;
let amqp = require('amqplib/callback_api');
let auth = require('./auth.json');

let channel;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console({
    colorize: true
}));
logger.level = 'debug';

amqp.connect(auth.URI, function (err, conn) {
    conn.createChannel(function (err, ch) {
        //channel = ch;
        ch.assertQueue(auth.queue, {durable: false});
        //ch.sendToQueue(auth.queue, direction)
    });
});

function init2() {
    document.getElementById("controller").innerHTML = "Robot stopped.";
}

function forward() {
    document.getElementById("controller").innerHTML = "Moving forward.";
    direction = "f";
    intervalId = setInterval(() =>{repeatMessage()}, timer);
}
function backwards() {
    document.getElementById("controller").innerHTML = "Moving backwards.";
    direction = "b";
    intervalId = setInterval(repeatMessage, timer);
}
function right() {
    document.getElementById("controller").innerHTML = "Moving right.";
    direction = "r";
    intervalId = setInterval(repeatMessage, timer);
}
function left() {
    document.getElementById("controller").innerHTML = "Moving left.";
    direction = "l";
    intervalId = setInterval(repeatMessage, timer);
}
function stop() {
    document.getElementById("controller").innerHTML = "Robot stopped.";
    direction = null;
}

function repeatMessage() {
    if(direction == null)
    {
        return;
    }
    amqp.connect(auth.URI, function (err, conn) {
        conn.createChannel(function (err, ch) {
            //channel = ch;
            ch.assertQueue(auth.queue, {durable: false});
            ch.sendToQueue(auth.queue, direction)
        });
    });
    document.getElementById("controller").innerHTML = "Repeating message.";
    console.log(" [x] Sent 'Hello World!'");
}
