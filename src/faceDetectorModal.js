export class FaceDetector {
    faceDetectionModelFolderPath = "/face-api/models";
    detectorOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });

    constructor(videoInput, canvas) {
        this.videoInput = videoInput;
        this.canvas = canvas;
    }

    async loadModel() {
        await faceapi.loadTinyFaceDetectorModel(this.faceDetectionModelFolderPath);
    }

    async detectAndMarkFace() {
        let faceDetections = await faceapi.detectAllFaces(this.videoInput, this.detectorOptions);
        let detectionsForSize = await faceapi.resizeResults(faceDetections, { width: this.videoInput.width, height: this.videoInput.height });
        let context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // console.log("detectionsForSize", detectionsForSize);
        await faceapi.draw.drawDetections(this.canvas, detectionsForSize);
    }

}