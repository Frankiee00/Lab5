// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

//obtaining the canvas
const canvas = document.getElementById("user-image");
let ctx = canvas.getContext('2d');

//creating buttons
const form = document.getElementById("generate-meme");
const clearButton = document.querySelector("[type='reset']");
const readButton = document.querySelector("[type='button']");
const submit = document.querySelector("[type='submit']");
const volumeSlider = document.querySelector("[type='range']");

//The volume the voice slider is at
var voiceVolume = volumeSlider.value;

//Speech Synthesis variables
var synth = window.speechSynthesis;
var speaking = true;

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {

  //clearing the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  
  //toggling buttons
  clearButton.disabled = true;
  readButton.disabled = true;
  submit.disabled = false;

  //filling canvas with black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);  

  //creating the picture 
  var pictures = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, pictures["startX"], pictures["startY"], pictures["width"], pictures["height"]);

  // TODO
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

//Implementing image input
const input = document.getElementById("image-input");

input.addEventListener('change', (event) => {
  img.src = URL.createObjectURL(input.files[0]);
  img.alt = input.files[0].name;
});

//implementing the form
form.addEventListener('submit', (event) => {
  event.preventDefault();

  var top_text = document.getElementById('text-top').value;
  var bottom_text = document.getElementById('text-bottom').value;
  
  ctx.font = "bold 20px arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  //ctx.strokeStyle = 'black'

  ctx.fillText(top_text, (canvas.width / 2), 30);
  ctx.fillText(bottom_text, (canvas.width / 2), canvas.height - 20);

  clearButton.disabled = false;
  readButton.disabled = false;
  submit.disabled = true;

});

//Implementing the Clear Button
clearButton.addEventListener('click', (event) => {
  
  //clears text input
  document.getElementById('text-top').value = "";
  document.getElementById('text-bottom').value = "";

  //clear canvas and set it again
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //set the buttons
  readButton.disabled = true;
  clearButton.disabled = true;
  submit.disabled = false;
  
});

//Implementing the Read text button
readButton.addEventListener("click", (event) => {
  
  event.preventDefault();

  var selectVoice = document.querySelector('select');
  selectVoice.disabled = false;
  var voices = synth.getVoices();
  
  if(speaking == true){
    for(var i = 0; i < voices.length; i++){
      var option = document.createElement("option");
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      if(voices[i].default){
        option.textContent += ' -- Default';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      selectVoice.appendChild(option);
    }
  }

    speaking = false;
  
  
  var bottom_text = document.getElementById("text-bottom").value;
  var top_text = document.getElementById("text-top").value;
  var talk = new SpeechSynthesisUtterance(top_text+bottom_text);

  var selection = selectVoice.selectedOptions[0].getAttribute('data-name');
  for(i = 0; i < voices.length; i++){
    if(voices[i].name === selection){
      talk.voice = voices[i];
    }
  }

  talk.volume = volumeSlider.value / 100;
  synth.speak(talk);

});


//Implementing volume slider 
volumeSlider.addEventListener("input", (event) => {
  voiceVolume = volumeSlider.value;
  const icon = document.getElementById("volume-group").getElementsByTagName("img")[0];

  if(voiceVolume == 0){
    icon.src = "icons/volume-level-0.svg";
    icon.alt = "Volume Level 0";
  }
  else if(voiceVolume >= 1 && voiceVolume <= 33){
    icon.src = "icons/volume-level-1.svg";
    icon.alt = "Volume Level 1";
  }
  else if(voiceVolume >= 34 && voiceVolume <= 66){
    icon.src = "icons/volume-level-2.svg";
    icon.alt = "Volume Level 2";
  }
  else if(voiceVolume >= 67 && voiceVolume <= 100){
    icon.src = "icons/volume-level-3.svg";
    icon.alt = "Volume Level 3";
  }
});



/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
