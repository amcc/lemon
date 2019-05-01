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
let videoLoaded;

function modelReady() {
  console.log("model is ready");
  mobilenet.predict(1000, gotResult);
}
// function imageReady() {
//   image(puffin, 0,0,width, height);
// }

function gotResult(error, results) {
  if (error) {
    // console.error(error)
  } else {
    if (!resultOne) {
      // console.log(results);
      resultOne = true;
    }

    resultNumber = search("lemon", results);
    // console.log('search = ' + resultNumber);

    label = results[0].className;
    label += "\n";
    var firstProb = Math.round(results[0].probability * 1000000) / 10000;
    firstProb = firstProb.toFixed(3);
    if (firstProb < 10) {
      firstProb = "0" + firstProb;
    }
    label += firstProb + "%";
    label += "\n";
    label += results[resultNumber].className;
    label += "\n";
    var secondProb =
      Math.round(results[resultNumber].probability * 1000000) / 10000;
    secondProb = Math.abs(secondProb.toFixed(3));
    if (secondProb < 10) {
      secondProb = "0" + secondProb;
    }
    label += secondProb + "%";

    // label += "\n";
    // label += resultNumber + " - " + (1000-resultNumber)/10 + "%";

    // bar length as number out of 1000
    // barLength = (1000-resultNumber)/1000 * width;

    // bar length as percentage of best guess
    barLength =
      (results[resultNumber].probability / results[0].probability) *
      width;
    // bar length as percentage of best guess with a bit of position
    // barLength = results[resultNumber].probability/results[0].probability * width;
  }
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  console.log("the width is " + width + " and the height is " + height);
  label = "learning...";
  video = createCapture(
    {
      audio: false,
      video: {
        facingMode: "environment"
      }
    },
    function() {
      // videoLoaded = true;
      // console.log('capture ready.')
    }
  );
  video.elt.setAttribute("playsinline", "");
  // video.hide();
  // video.size(w, h);
  // canvas = createCanvas(w, h);
  // video = createCapture(constraints);
  // video.hide();
  background(0);
  mobilenet = ml5.imageClassifier("MobileNet", video, modelReady);
}

function draw() {
  // background(0);
  // only predict every now and then
  if (countDown == 0) {
    mobilenet.predict(1000, gotResult);
    countDown = 15;
  }
  countDown--;

  if(videoLoaded){
    showVideoImage(video);
  }
  // make the bars and text...
  // height for both bars
  var yellowRectHeight = height / 10;
  // make a white bar at the top
  //fill(255, 40);
  // rect(0,0,width, yellowRectHeight)
  // make a yellow lemon rating bar!
  fill(255, 255, 51);
  noStroke();
  rect(0, height - yellowRectHeight, barLength, yellowRectHeight);
  // make the text
  fill(255);
  textFont("Roboto Condensed");
  textSize(height / 19);
  text(label, 20, height / 2);
  clear();
}

function showVideoImage(video) {
  // lay out the video
  var vidRatio = video.width / video.height;
  var screenRatio = width / height;
  var vidWidth;
  var vidHeight;
  var vidXPos;
  var vidYPos;
  // alter the video depending on the screen ratio
  console.log("video");
  console.log(video);
  if (screenRatio > 1) {
    vidWidth = width;
    vidHeight = width / vidRatio;
    vidXPos = 0;
    vidYPos = (width / vidRatio - height) / 2;
    image(video, vidXPos, -vidYPos, width, width / vidRatio);
  } else {
    vidWidth = height * vidRatio;
    vidHeight = height;
    vidXPos = (height * vidRatio - width) / 2;
    vidYPos = 0;
    image(video, vidXPos, vidYPos, vidWidth, vidHeight);
    console.log("-vidXPos " + -vidXPos);
    console.log("vidYPos " + vidYPos);
    console.log("height*vidRatio " + height * vidRatio);
    console.log("height " + height);
  }
}

function search(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].className === nameKey) {
      return i;
    }
  }
}
