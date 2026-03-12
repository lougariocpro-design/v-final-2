let angle = 0
let direction = 1
let radarColor = [0,255,150]

function setup(){

let canvas = createCanvas(800,500)

canvas.parent("radarCanvas")

angleMode(DEGREES)

}

function draw(){

background(0)

translate(width/2,height)

stroke(radarColor)

strokeWeight(2)

noFill()

for(let r=100;r<=400;r+=100){

arc(0,0,r*2,r*2,180,360)

}

for(let a=0;a<=180;a+=30){

let x = 400*cos(a)

let y = -400*sin(a)

line(0,0,x,y)

}

strokeWeight(4)

let x = 400*cos(angle)

let y = -400*sin(angle)

line(0,0,x,y)

angle += direction*2

if(angle>=180 || angle<=0){

direction *= -1

}

}

function changeColor(){

radarColor = [
random(100,255),
random(100,255),
random(100,255)
]

}

async function connectBluetooth(){

try{

const device = await navigator.bluetooth.requestDevice({
acceptAllDevices:true
})

await device.gatt.connect()

alert("Bluetooth connecté")

}catch(e){

alert("Connexion refusée")

}

}
