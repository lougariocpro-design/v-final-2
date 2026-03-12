let angle = 0
let distance = 0

let detections = []

let port
let reader

function setup(){

let canvas = createCanvas(800,500)

canvas.parent("radar")

angleMode(DEGREES)

}

function draw(){

background(0,40)

translate(width/2,height)

drawRadarGrid()

drawSweep()

drawDetections()

}

function drawRadarGrid(){

stroke(0,255,120)
noFill()

for(let r=100;r<=400;r+=100){

arc(0,0,r*2,r*2,180,360)

}

for(let a=0;a<=180;a+=30){

let x=400*cos(a)
let y=-400*sin(a)

line(0,0,x,y)

}

}

function drawSweep(){

for(let i=0;i<15;i++){

stroke(0,255,120,150-i*10)
strokeWeight(3)

let a = angle - i*2

let x = 400*cos(a)
let y = -400*sin(a)

line(0,0,x,y)

}

}

function drawDetections(){

stroke(255,0,0)
strokeWeight(5)

for(let p of detections){

let x=p.d*cos(p.a)
let y=-p.d*sin(p.a)

point(x,y)

}

}

function connectBluetoothHM10(){

let bluetoothDevice;
let bluetoothServer;
let bluetoothCharacteristic;

async function connectBluetoothHM10() {
  try {
    // Demande de connexion au HM-10
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'HM' }], // ou le nom exact de ton module
      optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // service HM-10
    });

    bluetoothServer = await bluetoothDevice.gatt.connect();

    const service = await bluetoothServer.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
    bluetoothCharacteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

    await bluetoothCharacteristic.startNotifications();
    bluetoothCharacteristic.addEventListener('characteristicvaluechanged', handleBLEData);

    document.getElementById("status").innerText = "CONNECTED";

  } catch (error) {
    alert("Connexion Bluetooth échouée : " + error);
  }
}

function handleBLEData(event) {
  const value = new TextDecoder().decode(event.target.value);
  const data = value.trim().split(",");
  if (data.length === 2) {
    angle = Number(data[0]);
    distance = Number(data[1]);

    document.getElementById("angle").innerText = angle;
    document.getElementById("distance").innerText = distance;

    let d = map(distance, 0, 200, 0, 400);
    detections.push({ a: angle, d: d });
    
    // Limiter le nombre de points pour la fluidité
    if (detections.length > 200) detections.shift();
  }
}
async function readSerial(){

const decoder = new TextDecoderStream()

port.readable.pipeTo(decoder.writable)

reader = decoder.readable.getReader()

while(true){

const {value,done}=await reader.read()

if(done) break

if(value){

let data=value.trim().split(",")

if(data.length==2){

angle = Number(data[0])
distance = Number(data[1])

document.getElementById("angle").innerText=angle
document.getElementById("distance").innerText=distance

let d = map(distance,0,200,0,400)

detections.push({a:angle,d:d})

}

}

}

}
