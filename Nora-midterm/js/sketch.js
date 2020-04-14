var song,fft;
var b;

var tx=[]; 
var ty=[]; 
var big=[]; 
var a=0;
var r=0;
const T="";
let button=document.getElementById("submit");
button.addEventListener("click",askData);

function askData(){
  let inp=document.getElementById("search").value;

  var api="https://cors-anywhere.herokuapp.com/http://api.deezer.com/search/?q=";

  var c="&index=0&limit=2&output=json";

  var url=api+inp+c;
 

  fetch(url)
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    song=loadSound(data.data[0].preview,loaded);
    songT=data.data[0].title;
    arti=data.data[0].artist.name;
    console.log(songT);
    console.log(arti);
    fft.setInput(song);

    var info=document.getElementById("na");
    let old=info.firstChild;
    let newT=document.createTextNode("▷"+songT+"-"+arti);
    info.replaceChild(newT,old);
  })
  .catch(function(error){
    console.log("There was an error.");
  });

}

function loaded(){
  song.play();
}

function mousePressed() {
  if(mouseY<600){
    if(song.isPlaying() ) { // .isPlaying() returns a boolean
      song.pause();
      background(255,0,0);
    } else {
      song.play(); // playback will resume from the pause position
      background(0,255,0);
    }
  }
}

//visualize music
function setup() {
  createCanvas(1470, 800);

  colorMode(HSB);

  fft=new p5.FFT();

  for (var i=0;i<512;i++) {
    tx[i]=735+cos(r)*600;
    ty[i]=sin(r)*600-8;
    r+=2*PI/1024;
  }
}

function draw() {
  background(0);

  var spectrum=fft.analyze();

  var w=-0.5*PI/1024;
  
  strokeWeight(2);
  for (var i=1;i<1024;i++) {
    big[i]=spectrum[i];
  }
  for (var i=0;i<512;i++) {
    strokeCap(ROUND);

    stroke(i/3+60, 255, 255,0.2);
    line(tx[i]/3+500-big[i/2]*0.3*cos(w),ty[i]/3-big[i/2]*0.3*sin(w),tx[i]/3+500+big[i/2]*0.3*cos(w),ty[i]/3+big[i/2]*0.3*sin(w));
    
    stroke(i/3+60, 255, 255,0.7);
    line(tx[i]*0.6+300-big[i/2]*0.6*cos(w),ty[i]*0.6-big[i/2]*0.6*sin(w),tx[i]*0.6+300+big[i/2]*0.6*cos(w),ty[i]*0.6+big[i/2]*0.6*sin(w));
    
    stroke(i/3+60, 255, 255,1);
    line(tx[i]-big[i]*1.2*cos(w),ty[i]-big[i]*1.2*sin(w),tx[i]+big[i]*1.2*cos(w),ty[i]+big[i]*1.2*sin(w));
    
    w+=2*PI/1024;
  }  
}