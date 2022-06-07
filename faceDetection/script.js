const video = document.querySelector("#video");


// console.log(navigator);
const startVideo = async () => {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  video.srcObject = stream;
};

// startVideo();

// Promise.all([
//   faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
//   faceapi.nets.faceLandmark68Net.loadFromUri('./models'), //register different areas of the face(eyes, mouth, nose, etc)
//   faceapi.nets.faceRecognitionNet.loadFromUri('./models'), // help the api know where the face is(box around it)
//   faceapi.nets.faceExpressionNet.loadFromUri('./models') // know weather you smiling, frowing, etc
// ]).then(startVideo())


const loadModels = async () => {  
  // await faceapi.loadSsdMobilenetv1Model('./models') ; //fixes warning error if TinyOptions is not defined, research more on it
  await faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
  await faceapi.nets.faceLandmark68Net.loadFromUri("./models"), //register different areas of the face(eyes, mouth, nose, etc)
  await faceapi.nets.faceRecognitionNet.loadFromUri("./models"), // help the api know where the face is(box around it)
  await faceapi.nets.faceExpressionNet.loadFromUri("./models"); // know weather you smiling, frowing, etc
  startVideo();
};

loadModels();


video.addEventListener("play", ()=>{
  // console.log("Playing");

  // Draw a rectangle
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySizes = {width: video.width, height: video.height}
  faceapi.matchDimensions(canvas, displaySizes); // match canvas to the display size
  // Set an interval to rescan for faces,
  // DetectAllTheFacesCoughtByCamera(ElementYouWantToDetect, TheLibraryYouWantToUseToDetectFaces).whatYouWantToDetectTheseFacesWith()
  setInterval( async() => {
    const detections = await faceapi.detectAllFaces(video, 
      new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      // console.log(detections);
      const resizeDetections = faceapi.resizeResults(detections, displaySizes);
      // after detection and resizing(before drawing), clear canvas to avoid overlay and redrawing.
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) // clear fro 0, 0, widthand height of canvas
      faceapi.draw.drawDetections(canvas, resizeDetections) //draw detections
      faceapi.draw.drawFaceLandmarks(canvas, resizeDetections) //draw landmarks
      faceapi.draw.drawFaceExpressions(canvas, resizeDetections) //draw mode
  }, 100);
})