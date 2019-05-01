let mobilenet;
let video;
let label;
let probability;
let resultOne = false;
let resultNumber;
let countDown = 5;
let easing = 0.05;
let barLength = 0;
let lemonBar = 0;

function modelReady() {
  console.log('model is ready');
  mobilenet.predict(1000, gotResult);
}
// function imageReady() {
//   image(puffin, 0,0,width, height);
// }

function gotResult(error, results) {
  if(error){
    // console.error(error)
  } else {
    if(!resultOne){
      // console.log(results);
      resultOne = true;
    }

    resultNumber = search("lemon", results);
    // console.log('search = ' + resultNumber);

    label = results[0].className;
    label += "\n";
    var firstProb = Math.round(results[0].probability*1000000)/10000;
    firstProb = firstProb.toFixed(3);
    if (firstProb < 10){
      firstProb = "0"+firstProb;
    }
    label += firstProb+"%";
    label += "\n";
    label += results[resultNumber].className;
    label += "\n";
    var secondProb = Math.round(results[resultNumber].probability*1000000)/10000;
    secondProb = Math.abs(secondProb.toFixed(3));
    if (secondProb < 10){
      secondProb = "0"+secondProb;
    }
    label += secondProb+"%";

    // label += "\n";
    // label += resultNumber + " - " + (1000-resultNumber)/10 + "%";

    // bar length as number out of 1000
    // barLength = (1000-resultNumber)/1000 * windowWidth;

    // bar length as percentage of best guess
    barLength = results[resultNumber].probability/results[0].probability * windowWidth;
    // bar length as percentage of best guess with a bit of position
    // barLength = results[resultNumber].probability/results[0].probability * windowWidth;
  }
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  console.log("the width is " + width + " and the height is " + height);
  label = "learning...";
  video = createCapture({
        audio: false,
        video: {
            facingMode: "environment"
        }
    }, function() {
        // console.log('capture ready.')
    });
    video.elt.setAttribute('playsinline', '');
    video.hide();
    // video.size(w, h);
    // canvas = createCanvas(w, h);
  // video = createCapture(constraints);
  // video.hide();
  background(0);
  mobilenet = ml5.imageClassifier('MobileNet', video, modelReady)
}


function draw() {
  background(0);
  // only predict every now and then
  if(countDown == 0) {
    mobilenet.predict(1000, gotResult);
    countDown = 15;
  }
  countDown--;

  // lay out the video
  var vidRatio = video.width/video.height;
  var screenRatio = windowWidth/windowHeight;
  var vidWidth;
  var vidHeight;
  var vidXPos;
  var vidYPos;
  // alter the video depending on the screen ratio
  if (screenRatio > 1) {
    vidWidth = windowWidth;
    vidHeight = windowWidth / vidRatio;
    vidXPos = 0;
    vidYPos = (((windowWidth / vidRatio) - windowHeight) / 2);
    image(video, vidXPos, -vidYPos, windowWidth, windowWidth / vidRatio);
  } else {
    vidWidth = windowHeight*vidRatio;
    vidHeight = windowHeight;
    vidXPos = ((windowHeight*vidRatio) - windowWidth) / 2;
    vidYPos = 0;
    image(video, -vidXPos, vidYPos, windowHeight*vidRatio, windowHeight);
  }
  // make the bars and text...
  // height for both bars
  var yellowRectHeight = windowHeight/10;
  // make a white bar at the top
  //fill(255, 40);
  // rect(0,0,windowWidth, yellowRectHeight)
  // make a yellow lemon rating bar!
  fill(255,255,51);
  noStroke();
  rect(0, windowHeight-yellowRectHeight, barLength, yellowRectHeight);
  // make the text
  fill(255);
  textFont("Roboto Condensed");
  textSize(windowHeight/19);
  text(label, 20, height/2);
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].className === nameKey) {
            return i;
        }
    }
}
