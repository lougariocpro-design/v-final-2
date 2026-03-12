let angle = 0
let distance = 0

let points = []

let port
let reader

function setup(){

let canvas = createCanvas(800,500)

canvas.parent("radar")

angleMode(DEGREES)

}

function draw(){

background(0)

translate(width/2,height)

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

stroke(0,255,0)
strokeWeight(3)

let radarX=400*cos(angle)
let radarY=-400*sin(angle)

line(0,0,radarX,radarY)

for(let p of points){

let x=p.d*cos(p.a)
let y=-p.d*sin(p.a)

stroke(255,0,0)

point(x,y)

}

}

async function connectSerial(){

try{

port = await navigator.serial.requestPort()

await port.open({ baudRate:9600 })

document.getElementById("status").innerText="CONNECTED"

readSerial()

}catch(err){

alert("connection refused")

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

angle=Number(data[0])
distance=Number(data[1])

document.getElementById("angle").innerText=angle
document.getElementById("distance").innerText=distance

let d=map(distance,0,200,0,400)

points.push({a:angle,d:d})

}

}

}

}
