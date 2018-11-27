import * as requirejs from 'require.js';

requirejs.config({
    baseUrl: 'RobotControlInterface',
    paths: {
    }
});

//Code previously in test.html
let direction = null, intervalId = null, timer = 500;
let amqp = require('amqplib/callback_api');
let auth = require('./auth.json');

let channel;

amqp.connect(auth.URI, function (err, conn) {
    if(err){
        console.log(err)
    }
    conn.createChannel(function (err, ch) {
        if(err) {
            console.log(err);
        }
        channel = ch;
        channel.assertQueue(auth.queue, {durable: false});
        channel.sendToQueue(auth.queue, "test");
        console.log("RabbitMQ is connected.")
    });
    //setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

function forward() {
    document.getElementById("controller").innerHTML = "Moving forward.";
    direction = "f";
    intervalId = setInterval(repeatMessage, timer);
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
    clearInterval(intervalId)
}


function repeatMessage() {
    if(direction == null)
    {
        return;
    }
    // amqp.connect(auth.URI, function (err, conn) {
    //     conn.createChannel(function (err, ch) {
    //         //channel = ch;
    //         ch.assertQueue(auth.queue, {durable: false});
    //         ch.sendToQueue(auth.queue, direction)
    //     });
    // });
    channel.sendToQueue(auth.queue, direction);
    document.getElementById("controller").innerHTML = "Repeating message.";
    console.log(" [x] Sent 'Hello World!'");
}


var http = require('http'),
    fs = require('fs');


fs.readFile('./Test.html', function (err, html) {
    if (err) {
        throw err;
    }
    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(8000);
});