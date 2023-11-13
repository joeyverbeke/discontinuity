import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver } = vision;
let faceLandmarker;
let runningMode = "IMAGE";
let webcamRunning = false;
const videoWidth = 480;
let blinking = false;

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
video.style.display = "none"; // Hide the video element

// Check if webcam access is supported and start webcam.
function enableCam() {
    if (!faceLandmarker) {
        console.log("Wait! faceLandmarker not loaded yet.");
        return;
    }
    webcamRunning = true;
    // getUsermedia parameters.
    const constraints = {
        video: true
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

let lastVideoTime = -1;
let results = undefined;

async function predictWebcam() {
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
}

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

function triggerBlinkAction() {
    // Change background to black
    document.body.style.backgroundColor = "black";

    // Choose a random message
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    // Create a text element and add it to the screen
    const textElement = document.createElement('div');
    textElement.style.position = 'absolute';
    textElement.style.top = '50%';
    textElement.style.left = '50%';
    textElement.style.transform = 'translate(-50%, -50%)';
    textElement.style.color = 'white';
    textElement.style.fontSize = '24px';
    textElement.style.zIndex = '1000';
    textElement.innerText = phrase;
    document.body.appendChild(textElement);

    // Set a timeout to revert the action and remove the text after 100ms
    setTimeout(() => {
        document.body.style.backgroundColor = "white"; // Revert background color
        document.body.removeChild(textElement); // Remove the text element
    }, 25);
}