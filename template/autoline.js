var samples =20;
var speed = 1000;
let timeout= samples * speed;
var values = [];
var values2=[];
var values3=[];
var labels = [];
var charts = [];
var value = 0;
var scale = 1;

//addEmptyValues(values, samples);
//addEmptyValues(values2,samples);
//addEmptyValues(values3,samples);

var originalCalculateXLabelRotation = Chart.Scale.prototype.calculateXLabelRotation
var v;  //cpu
var v2; //mem
var v3; //mem2
//var v4;
// Called after form input is processed

//startConnect();


/*function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}*/

function startConnect() {
    // Generate a random client ID
    clientID = "clientID-" + parseInt(Math.random() * 100);

    // Fetch the hostname/IP address and port number from the form
    // host = document.getElementById("host").value;
    console.log("connect");
   // host=getParameterByName('ip_address');
    //host="54.180.90.198";
host="192.168.2.3"


    // port = document.getElementById("port").value;
    port="9001";
    // Print output for the user in the messages div
//    document.getElementById("messages").innerHTML += '<span>Connecting to: ' + host + ' on port: ' + port + '</span><br/>';
    //   document.getElementById("messages").innerHTML += '<span>Using the following client value: ' + clientID + '</span><br/>';

    // Initialize new Paho client connection
    client = new Paho.MQTT.Client(host, Number(port), clientID);

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({
        onSuccess: onConnect,
    });
//addEmptyValues(values,samples);
}

// Called when the client connects
function onConnect() {
    // Fetch the MQTT topic from the form
    // topic = document.getElementById("topic").value;
    topic="mon/#";
    // Print output for the user in the messages div
    document.getElementById("messages").innerHTML += '<span>Subscribing to: ' + topic + '</span><br/>';

    // Subscribe to the requested topic
    client.subscribe(topic);

}
// Called when the client loses its connection
function onConnectionLost(responseObject) {
    document.getElementById("messages").innerHTML += '<span>ERROR: Connection lost</span><br/>';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    }
}

// Called when a message arrives
function onMessageArrived(message) {
    switch(message.destinationName){
        case "mon/cpu/1":
            v = parseFloat(message.payloadString);
            console.log(v);
            break;
        case "mon/mem/nom":
            v2=parseFloat(message.payloadString);
            break;
        case "mon/mem/act":
            v3=parseFloat(message.payloadString);
            break;

    }
    console.log("onMessageArrived: " + message.payloadString);
    document.getElementById("messages").innerHTML += '<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>';
}

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}

//addEmptyValues(values,samples);
function initialize() {
    charts.push(new Chart(document.getElementById("chart0"), {
        type: 'line',
        data: {
            //labels: labels,
            datasets: [{
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                lineTension: 0.25,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: speed *1.0,
                easing: 'linear'
            },
            legend: false,
            scales: {
                xAxes: [{
                    type: "time",
                    display: true
                }],
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 0
                    }
                }]
            }
        }
    }), new Chart(document.getElementById("chart1"), {
        type: 'line',
        data: {
            //labels: labels,
            datasets: [{
                data: values2,
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2
            },
                {
                    data:values3,
                    backgroundColor:'rgba(167,105,0,0.4)',
                    borderColor:"rgb(167,105,0)",
                    borderWidth:2

                }

            ]
        },
        options: {
            responsive: true,
            animation: {
                duration: speed * 1.0,
                easing: 'linear'
            },
            legend: false,
            scales: {
                xAxes: [{
                    type: "time",
                    display: true
                }],
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 0
                    }
                }]
            }
        }
    }));
// addEmptyValues(values,samples);
}

function addEmptyValues(arr, n) {
    for(var i = 0; i < n; i++) {
        arr.push({
            x: moment().subtract((n - i) * speed, 'milliseconds').toDate(),
            y:v
        });
    }
}

function rescale() {
    var padding = [];

    addEmptyValues(padding, 10);
    values.splice.apply(values, padding);
    values2.splice.apply(values2,padding);
    values3.splice.apply(values3,padding);
    scale++;
}

function updateCharts(){
    charts.forEach(function(chart) {
        chart.update();
    });
}

function progress() {
    //value = Math.min(Math.max(value + (0.1 - Math.random() / 5), -1), 1);
    values.push({
        x: new Date(),
        y: v
    });

    values2.push({
        x:new Date(),
        y:v2
    });

    values3.push({
        x:new Date (),
        y:v3
    });

    values.shift();
    values2.shift();
    values3.shift();
}

function advance() {
    if (values[0] !== null && scale < 4) {
        rescale();
        updateCharts();
    }
    if( values2[0] !==null&&scale <4){
        updateCharts();
    }

    if (values3[0] !==null&&scale <4){
        updateCharts();
    }
    progress();
    updateCharts();

    setTimeout(function() {
        requestAnimationFrame(advance);
    }, speed);
}

window.onload = function() {
    startConnect();
    addEmptyValues(values,samples);
    initialize();
    advance();
};