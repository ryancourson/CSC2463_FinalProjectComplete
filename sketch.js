//Arduino Hardware


let serialPDM;
let portName = 'COM4';
let sensors;
let ledOn = true;
//let potentiometer;


//////////////////


let text;

let cols, rows;
let scale = 20;
let w = 1400;
let h = 1400;
let rotateVal;
let img;

var gradientColor1;
var gradientColor2;

let amplitudeValue = 0.01;

let flying = 0;

let sound, amplitude;

let amplitudeSmoothness;

let terrain = [];

function preload(){

  sound = loadSound('media/spirit_in_the_sky.mp3');

}


function setup() {
  createCanvas(800, 800, WEBGL);

  text = createGraphics(window.innerWidth -4, window.innerHeight -4 );
  text.textFont('Source Code Pro');
  text.textAlign(CENTER, TOP);
  text.textSize(16);
  text.fill(3,7,11);
  text.noStroke();
  text.text('Test', width / 2, height )

  serialPDM = new PDMSerial(portName);
  sensors = serialPDM.sensorData;

  // cnv.mouseClicked(togglePlay);
  amplitudeSmoothness = 0.95;
  amplitude = new p5.Amplitude([amplitudeSmoothness]);
  

  rotateVal  =  PI/2;
  img  = loadImage("fullSunset.png");

  gradientColor1 = color(250 ,56,192);
  gradientColor2 = color(102, 51, 153);
  
  cols = w / scale;
  rows = h / scale;

  //translate(-w/2, -h/2);
  //rotateX(PI/2);
  
  
  //setGradient(-400, -400, 2000, 600, gradientColor2, gradientColor1, "Y");
  
  //rotateX(PI/2);
  
  
}

function draw() {

  
  

  //background(0);

  let level = amplitude.getLevel();
  let size = map(level, 0, 1, 0.001, 5);
  let totalZScale = size * sensors.a0;
  console.log("Size: " + totalZScale);
  

  flying -= 0.075;

  let yoff = 0;
  for(let i = 0; i < rows; i++){
    let xoff = flying;
    terrain[i] = [];
    for(let j = 0; j < cols; j++){
      terrain[i][j] = map(noise(xoff,yoff), 0, 1, -20, 80);
      //terrain[i][j] = map(noise(i,j), 0, 1, -40, 40);
      xoff += 0.1;
    }
    yoff += 0.075;
  }

  
  background(0);
  

  stroke(199, 36, 177);
  // stroke(102, 51, 153);
  fill(102, 51, 153);
  //noStroke();
  


  rotateX(rotateVal);
  //rotateVal += 0.005;
  translate(-w/2, -h/2, -40);
  

  

  for(let y = 0; y < rows - 1; y++){
    beginShape(TRIANGLE_STRIP);
    
    for(let x = 0; x < cols; x++){
      if(x < 15 * cols / 32 || x > 17 * cols / 32){

        //This is where we scale the z-values of the mesh

        vertex(x * scale, y * scale, terrain[x][y] * totalZScale);
        vertex(x*scale, (y+1) * scale, terrain[x][y+1]  * totalZScale);
      }

      else{
        vertex(x * scale, y * scale);
        vertex(x * scale, (y+1) * scale);
      }
      
    }
    endShape();
  }

  
  rotateX(PI/2);
  rotateY(PI);
  rotateZ(PI);
  
  image(img, -1450, -1020, img.width * 1, img.height * 1);
  //texture(text);
  


  
  

}

function keyTyped() {
  if(key === 'a' && !ledOn){
      serialPDM.transmit('led', 1);
      console.log(key + ", led on!");
      ledOn = true;
  }

  else if(key === 'a' && ledOn){
      serialPDM.transmit('led', 0);
      console.log(key + ", led off!");
      ledOn = false;
  }
  
}

function keyPressed(){

  if(keyCode === UP_ARROW){
    amplitudeValue += 0.2;
  }

  else if(keyCode === DOWN_ARROW){
    amplitudeValue -= 0.2;
  }

  else if(keyCode === 32){
    togglePlay();
    
  }

}

function togglePlay(){
  if (sound.isPlaying()){
    sound.pause();
    size = 0.1;
    serialPDM.transmit('led', 0);
    console.log(key + ", led off!");
    ledOn = false;
  }
  else{
    serialPDM.transmit('led', 1);
    console.log(key + ", led on!");
    ledOn = true;
    sound.loop();
    amplitude = new p5.Amplitude([amplitudeSmoothness]);
    amplitude.setInput(sound);
  }
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis == "Y") {  // Top to bottom gradient
    for (let i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == "X") {  // Left to right gradient
    for (let j = x; j <= x+w; j++) {
      var inter2 = map(j, x, x+w, 0, 1);
      var d = lerpColor(c1, c2, inter2);
      stroke(d);
      line(j, y, j, y+h);
    }
  }
}
