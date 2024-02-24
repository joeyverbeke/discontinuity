import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { FaceLandmarker, FilesetResolver } = vision;
let faceLandmarker;
let runningMode = "IMAGE";
let webcamRunning = false;
const videoWidth = 480;
let blinking = false;

let totalFrames = 50; // Total number of frames you have
let currentFrame = 1; // Start from the first frame
let imageDirectory = "/images/";

let phrases = 
[
    "identity’s silent // seamless stream",
    "unconscious // conscious blooms",
    "continuity // identity's dance",
    "veil lifted // self revealed",
    "unseen journey // conscious arrival",
    "unconscious threads // conscious loom",
    "eternal self // veiled voyage",
    "silent dialogue // spoken being",
    "unveiling // identity's choreography",
    "flow of unseen // seen self",
    "continuous whisper // spoken being",
    "dance // veiled revelations",
    "identity // a silent river’s flow",
    "unconscious echo // conscious light",
    "unveiling // endless self",
    "veiled voyage // known shores",
    "unending narrative // self unveiled",
    "silent tapestry // vivid becoming",
    "conscious veil // unconscious reveal",
    "unbroken thread // woven being"
];

async function createFaceLandmarker() {
    const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode,
        numFaces: 1
    });
    enableCam(); // Automatically start the webcam and detection
}

createFaceLandmarker();

const video = document.getElementById("webcam"); // Get the video element from the DOM
//video.style.display = "none"; // Hide the video element

const vivoVide = document.getElementById("vivoVid");

// Check if webcam access is supported and start webcam.
function enableCam() {
    if (!faceLandmarker) {
        console.log("Wait! faceLandmarker not loaded yet.");
        return;
    }
    webcamRunning = true;
    // getUsermedia parameters.
    const constraints = {
        video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            //frameRate: { ideal: 120 }
        }
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
            const videoTrack = stream.getVideoTracks()[0];
            const settings = videoTrack.getSettings();
            console.log(`Actual resolution: ${settings.width}x${settings.height}`);
            console.log(`Actual frame rate: ${settings.frameRate}`);
            predictWebcam();
        });
    });
}

let lastVideoTime = -1;
let results = undefined;

async function predictWebcam() {
    let startTime = performance.now();
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await faceLandmarker.setOptions({ runningMode: runningMode });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = await faceLandmarker.detectForVideo(video, startTimeMs);
    }
    if (results) {
        detectBlinking(results.faceBlendshapes);
    }
    if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam);
    }
    let endTime = performance.now();
    let inferenceTime = Math.floor((endTime - startTime) * 10) / 10;
    //if (inferenceTime > 1)
    //console.log("Inference Time: " + inferenceTime + "ms");
}

/*
//blink threshold detection
function detectBlinking(blendShapes) {
    if (!blendShapes.length) {
        return;
    }
    let currentlyBlinking = blendShapes[0].categories[9].score > 0.5 || 
                            blendShapes[0].categories[10].score > 0.5;

    if (currentlyBlinking && !blinking) {
        blinking = true;
        triggerBlinkAction();
    } else if (!currentlyBlinking && blinking) {
        blinking = false;
    }
}
*/

let blinkThreshold = 0.5;
let isBlinking = false;

function detectBlinking(blendShapes) {
    if (!blendShapes.length) {
        return;
    }

    let currentBlinkScore = Math.max(blendShapes[0].categories[9].score, blendShapes[0].categories[10].score);

    if (currentBlinkScore > blinkThreshold && !isBlinking) {
        blinkStart();
        isBlinking = true;
    } else if (currentBlinkScore <= blinkThreshold && isBlinking) {
        blinkStop();
        isBlinking = false;
    }
}

function blinkStart() {
    console.log("blink started at " + new Date().toLocaleString() + " " + new Date().getMilliseconds() + "ms");
    //controlLED(true);
    //displayMessage();
    //sendBlinkState(1);
    displayImage();
}

function blinkStop() {
    console.log("blink stopped" + new Date().toLocaleString() + " " + new Date().getMilliseconds() + "ms");
    //controlLED(false);
    //clearMessage();
    //sendBlinkState(0);
    imageElement.style.display = 'none'; // Hide the image
}

let imageElement = document.getElementById('blink-image');

function displayImage() {
    let imageUrl = imageDirectory + "canvas_" + String(currentFrame).padStart(5, '0') + ".png";
    imageElement.src = imageUrl;
    imageElement.style.display = 'block'; // Show the image
    currentFrame = (currentFrame % totalFrames) + 1; // Cycle through frames
    console.log(currentFrame);
}

async function sendBlinkState(state) {
    try {
        const response = await fetch('http://localhost:3000/blink', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state: state }),
        });
        const data = await response.text();
    } catch (error) {
        console.error('Error:', error);
    }
}

function toggleBackground(color) {
    document.body.style.backgroundColor = color;
}

function displayMessage() {
    const phrase = getRandomPhrase();
    const textElement = createTextElement(phrase);
    document.body.appendChild(textElement);
}

function getRandomPhrase() {
    return phrases[Math.floor(Math.random() * phrases.length)];
}

function createTextElement(text) {
    const textElement = document.createElement('div');
    textElement.className = 'message-text';
    Object.assign(textElement.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontSize: '24px',
        zIndex: '1000'
    });
    textElement.innerText = text;
    return textElement;
}

function clearMessage() {
    // Select the div with the specific class
    const textElement = document.querySelector('.message-text');
    if (textElement) {
        document.body.removeChild(textElement);
    }
}

async function controlLED(turnOn) {
    try {
        const response = await fetch('http://localhost:3000/control-led', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state: turnOn }),
        });
        const data = await response.text();
        //console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}