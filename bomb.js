//
// global variables (placed at top for convention)
//

// set time remaining to 30
var totalTime = 10;
var time = totalTime;
var interval, siren;

//
// wait for tags to be finished
//
document.addEventListener('DOMContentLoaded', function() {
  console.log("Dom got loaded!");

  document.getElementById('init').addEventListener('click', start);

});

//
// start game
//
function start() {
  console.log('starting game');
  addWireListeners();
  // reset game state
  reset();
  // start game
  clearInterval(interval);
  // TODO update time in the dom
  interval = setInterval(tick, 1000);
  // begin siren
  siren = document.getElementById('siren');
  siren.play();
}

function reset() {
  time = totalTime;
  document.getElementById('timer').style.color = 'green';
  document.getElementsByTagName('body')[0].classList.remove('exploded');
  document.getElementsByTagName('body')[0].classList.add('unexploded');
  document.getElementById('message').textContent = "Good luck!";
}

//
// function to progress timer
//

function tick() {
  // TODO convert console.log to ( , ) syntax to prevent string conversions
  console.log('tick, time is ' + time);
  time -= 1;
  // TODO update time in the dom
  document.getElementById('timer').textContent = time;
  if (time === 3) {
    document.getElementById('timer').style.color = 'red';
  }
  if (!(time > 0)) {
    loseGame();
  }
}

//
// game endings
//

function endGame() {
  // pause timer
  clearInterval(interval);
  // wires should no longer be interactable
  removeWireListeners();
  // stop game track
  siren.pause();
}

function loseGame(){
  clearInterval(interval);
  // show explosion
  document.getElementsByTagName('body')[0].classList.remove('unexploded');
  document.getElementsByTagName('body')[0].classList.add('exploded');

  // call common end game actions
  endGame();
  // play explosion noise
  var explodeSound = document.getElementById('explodeSound');
  explodeSound.play();

  // "you lose" popup
  // TODO fix message to be multiline
  document.getElementById('message').textContent = "You lose.";

  // remove wire listeners
  removeWireListeners();
}

function winGame() {
  console.log('begin victory conditions!');
  // call common end game actions
  endGame();
  //
  // play victory sound sequence
  //
  // get cheer sound
  var cheer = document.getElementById('cheer');
  // setup a trigger to cheer, so that after it triggers
  cheer.addEventListener('ended', function() {
    document.getElementById('success').play();
  });
  // play cheer
  cheer.play();
}

//
// event listeners
//

// helper function to add/remove listener
function addWireListeners() {
  console.log('Adding event listeners to wires');
  // NOTE: utilizes combo selector
  var wireImg = document.querySelectorAll('#wireBox img');
  // confirm aquisition
  console.log(wireImg, " is the wire image list");
  for (var i = 0; i < wireImg.length; i++) {
    wireImg[i].src = "img/uncut-" + wireImg[i].id + "-wire.png";
    // TODO set random data-cut
    wireImg[i].setAttribute('data-cut', (Math.random() > 0.5).toString());
    console.log(wireImg[i]);
    wireImg[i].addEventListener('click', clickWire);
  }

  // check for no cuttable wire edge case, reset game if case
  if(checkWin()) {
    start()
  }
}

function removeWireListeners() {
  console.log('removing event listeners to wires');
  // NOTE: utilizes combo selector
  var wireImg = document.querySelectorAll('#wireBox img');
  // confirm aquisition
  console.log(wireImg, " is the wire image list");
  for (var i = 0; i < wireImg.length; i++) {
    wireImg[i].removeEventListener('click', clickWire);
  }
}

// click wire
function clickWire() {
  console.log('wire clicked!', this.id);
  this.src= "img/cut-" + this.id + "-wire.png";
  this.removeEventListener('click', clickWire);

  if(this.getAttribute('data-cut') == 'true') {
    console.log('You have chosen, wisely.');
    this.setAttribute('data-cut', 'false');
    // play wire cut sound
    document.getElementById('buzz').play();
    // successfully cut a correct wire, check if the game is over
    if (checkWin()) {
      // victory conditions met, win the game
      winGame();
    }
    else {
      // continue message?? you made progress message? remaining?
    }
  }
  else {
    console.log("aaaaaand you're dead");
    loseGame();
  }
}

// call this to check all wires for cut status
function checkWin() {
  var wireImg = document.querySelectorAll('#wireBox img');

  for (var i = 0; i < wireImg.length; i++) {
    if (wireImg[i].getAttribute('data-cut') === 'true') {
      return false;
    }
  }
  return true;
}
