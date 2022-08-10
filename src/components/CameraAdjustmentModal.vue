<template>
    <div class="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Adjust your webcam for best detection</h5>
                </div>

                <div class="face-detect-modal-body modal-body">
                    <video ref="inputVideoModal" class="video-input" autoplay muted height="250" width="250"></video>
                    <canvas ref="faceDetectCanvas" class="face-detect-canvas"></canvas>
                </div>

                <div class="modal-footer">
                    <button @click="closeWebcam" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {FaceDetector} from "../faceDetectorModal";
import { mapGetters, mapActions } from 'vuex';
export default {
    name: "CameraAdjustmentModal",
    video: null,
    webCamStream: null,
    canvas: null,
    // faceDetector: null,
    mounted() {
        // this.video = this.$refs.inputVideoModal;
        // this.canvas = this.$refs.faceDetectCanvas;
        // this.canvas.width = this.video.width;
        // this.canvas.height = this.video.height;
        // this.faceDetector = new FaceDetector(this.video, this.canvas);
        // this.startWebcam();
    },
    methods: {
        ...mapActions([
            "updateCamAdjustmentModalState",
        ]),
        sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
        },
        async startWebcam() {
            this.video = this.$refs.inputVideoModal;
            this.canvas = this.$refs.faceDetectCanvas;
            let faceDetector = new FaceDetector(this.video, this.canvas);
            console.log("startWebcam function run");
            console.log(this.video);
            this.webCamStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            this.video.srcObject = this.webCamStream;
            this.canvas.width = this.video.width;
            this.canvas.height = this.video.height;
            await this.sleep(500);
            await faceDetector.loadModel();
            let context;
            while (this.camAdjustmentModalState === "on") {
                // context = this.canvas.getContext('2d');
                // context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                await faceDetector.detectAndMarkFace();
                // console.log("webCamStream", this.webCamStream);
                // console.log(this.video.srcObject);
                // console.log(faceapi);
                // faceDetections = await faceapi.detectAllFaces(this.video);
                // console.log("hello2");
                // console.log(faceDetections);
                // console.log("detectionsForSize", detectionsForSize);
            };
            console.log("startWebcam function end!");
        },
        async closeWebcam() {
            const tracks = this.webCamStream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            await this.updateCamAdjustmentModalState();
        },
    },
    computed: {
        ...mapGetters([
            "camAdjustmentModalState",
        ])
    },
    watch: {
        camAdjustmentModalState(newState, oldState) {
            if (newState === "on") {
                this.startWebcam();
            } 
        }
    }
}
</script>

<style>
.face-detect-modal-body {
    height: 600;
}

.face-detect-canvas {
    left: 25%;
    position: absolute;
    z-index: 10; 
}
</style>