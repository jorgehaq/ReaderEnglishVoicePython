var currentIndex = 0;
var isReading = false;
var contentLinks = document.querySelectorAll('#main-reading a.link');
var maleVoice = null;
var rateVoice = 1.0;

function initialize() {

    maleVoice = speechSynthesis.getVoices().find(function (voice) {
        //return voice.name==
        //return voice.name === 'Google UK English Male';
        //return voice.name === 'your-male-voice-name'; // Replace with the name of the male voice
        return voice.name.indexOf('Male') !== -1;
    });

    contentLinks.forEach(function (link, index) {
        link.addEventListener('click', function (event) {
            speechSynthesis.cancel();
            isReading = false;
            event.preventDefault();

            currentIndex = index;
            setActiveLink(link); // Highlight the clicked link
            var linkText = link.getAttribute('data-text');
            var translationUrl = '/translate_word/' + encodeURIComponent(linkText);
            fetch(translationUrl)
                .then(response => response.text())
                .then(translationMessage => {
                    var translateReading = document.getElementById('translate-reading');
                    translateReading.innerHTML = translationMessage;
                    isReading = true;
                    playButton.textContent = 'Stop';
                    playButton.classList.remove('greenButton'); // Remove the initial class
                    playButton.classList.add('redButton'); // Add the new class

                    pauseButton.classList.remove('greenButton'); // Remove the initial class
                    pauseButton.classList.add('blueButton'); // Add the new class
                    pauseButton.textContent = 'Pause';
                    
                    readNextLink();
                });
        });
    });
}







function readNextLink() {

    if (currentIndex < contentLinks.length) {
        var link = contentLinks[currentIndex];
        var linkText = link.getAttribute('data-text');
        var translationUrl = '/translate_word/' + encodeURIComponent(linkText);
        setActiveLink(link);
        fetch(translationUrl)
            .then(response => response.text())
            .then(translationMessage => {

                var parser = new DOMParser();

                var utterance = new SpeechSynthesisUtterance(linkText);
                //utterance.voice = maleVoice;
                utterance.name = 'Google UK English Male'
                utterance.lang = 'en-GB';
                utterance.rate = rateVoice;
                speechSynthesis.speak(utterance);

                var translateReading = document.getElementById('translate-reading');
                translateReading.innerHTML = translationMessage;

                utterance.onend = function () {
                    currentIndex++;
                    readNextLink();
                };
            });
    } else {
        isReading = false;
    }
}




// Add these lines to your script.js
var playButton = document.getElementById('play-button');
var normalButton = document.getElementById('normal-button');
var slowButton = document.getElementById('slow-button');
var superSlowButton = document.getElementById('super-slow-button');
var activeLink = null;

playButton.addEventListener('click', function () {

    if (!isReading) {
        playButton.classList.remove('greenButton'); // Remove the initial class
        playButton.classList.add('redButton'); // Add the new class
        playButton.textContent = 'Stop';
        isReading = true;
        readNextLink();
    }
    else {
        isReading = false;
        playButton.classList.remove('redButton'); // Remove the initial class
        playButton.classList.add('greenButton'); // Add the new class
        playButton.textContent = 'Start';
        speechSynthesis.cancel();

        pauseButton.classList.remove('greenButton'); // Remove the initial class
        pauseButton.classList.add('blueButton'); // Add the new class
        pauseButton.textContent = 'Pause';
    }

});



var pauseButton = document.getElementById('pause-button');
var isPause=false;

// Pause the speech
pauseButton.addEventListener('click', function() {

    if(isReading){
        if(!isPause){
            speechSynthesis.pause();
            isPause=true;

            pauseButton.classList.remove('blueButton'); // Remove the initial class
            pauseButton.classList.add('greenButton'); // Add the new class
            pauseButton.textContent = 'Continue';
        }
        else{
            speechSynthesis.resume();
            isPause=false;

            pauseButton.classList.remove('greenButton'); // Remove the initial class
            pauseButton.classList.add('blueButton'); // Add the new class
            pauseButton.textContent = 'Pause';
        }    
    }
});




normalButton.addEventListener('click', function () {
    speechSynthesis.cancel();

    rateVoice = 1.0;

    if (isReading) {
        readNextLink();
    }

    setColorSpeedButton('normal');

});

slowButton.addEventListener('click', function () {
    speechSynthesis.cancel();

    rateVoice = 0.8;

    if (isReading) {
        readNextLink();
    }

    setColorSpeedButton('slow');
});


superSlowButton.addEventListener('click', function () {
    speechSynthesis.cancel();

    rateVoice = 0.5;

    if (isReading) {
        readNextLink();
    }

    setColorSpeedButton('super-slow');
});

function setColorSpeedButton(opt) {
    switch (opt) {
        case 'slow':

            normalButton.classList.remove('grayButton'); // Remove the initial class
            normalButton.classList.add('blueButton'); // Add the new class

            slowButton.classList.remove('blueButton'); // Remove the initial class
            slowButton.classList.add('grayButton'); // Add the new class

            superSlowButton.classList.remove('grayButton'); // Remove the initial class
            superSlowButton.classList.add('blueButton'); // Add the new class

            break;
        case 'super-slow':

            normalButton.classList.remove('grayButton'); // Remove the initial class
            normalButton.classList.add('blueButton'); // Add the new class

            slowButton.classList.remove('grayButton'); // Remove the initial class
            slowButton.classList.add('blueButton'); // Add the new class

            superSlowButton.classList.remove('blueButton'); // Remove the initial class
            superSlowButton.classList.add('grayButton'); // Add the new class

            break;
        default:
            normalButton.classList.remove('blueButton'); // Remove the initial class
            normalButton.classList.add('grayButton'); // Add the new class

            slowButton.classList.remove('grayButton'); // Remove the initial class
            slowButton.classList.add('blueButton'); // Add the new class

            superSlowButton.classList.remove('grayButton'); // Remove the initial class
            superSlowButton.classList.add('blueButton'); // Add the new class

            break;
    }
}



function setActiveLink(link) {
    if (activeLink) {
        activeLink.classList.remove('active-link');
    }
    activeLink = link;
    activeLink.classList.add('active-link');

    // Calculate the position of the active link relative to the #main-reading div
    var activeLinkPosition = activeLink.offsetTop;

    // Calculate the scroll position by adjusting for the current scroll and the link's position
    var scrollPosition = activeLinkPosition - 146; // Adjust 100 as needed

    // Scroll the content within the #main-reading div to the calculated position    
    document.getElementById('left-div').scrollTop = scrollPosition;

    // Scroll the #right-div to the top
    document.getElementById('right-div').scrollTop = 30;
}


// Get references to the HTML elements
const mainTextReading = document.getElementById('main-reading');
const translateTextElement = document.getElementById('translate-reading');
const increaseButton = document.getElementById('increase-font-size');
const decreaseButton = document.getElementById('decrease-font-size');

// Set an initial font size
let fontSize = 16; // Initial font size in pixels

// Add event listeners to buttons
increaseButton.addEventListener('click', () => {
  fontSize += 2; // Increase font size by 2 pixels
  mainTextReading.style.fontSize = fontSize + 'px';
  translateTextElement.style.fontSize = fontSize + 'px';
});

decreaseButton.addEventListener('click', () => {
  if (fontSize > 8) { // Avoid font size getting too small
    fontSize -= 2; // Decrease font size by 2 pixels
    mainTextReading.style.fontSize = fontSize + 'px';
    translateTextElement.style.fontSize = fontSize + 'px';
  }
});






initialize();

