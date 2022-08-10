<template>
    <div class="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Adjust your webcam for best detection</h5>
        </div>
        <div class="modal-body container">
            <video ref="inputVideoModal" class="modal-cam-video" autoplay muted height="250" width="250"></video>
        </div>
        <div class="modal-footer">
            <button @click="closeWebcam" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: "CameraAdjustmentModal",
    video: null,
    webCamStream: null,
    mounted() {
        this.video = this.$refs.inputVideoModal;
        // this.startWebcam();
    },
    methods: {
        ...mapActions([
            "updateCamAdjustmentModalState",
        ]),
        async startWebcam() {
            this.webCamStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            this.video.srcObject = this.webCamStream;
        },
        closeWebcam() {
            const tracks = this.webCamStream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            this.updateCamAdjustmentModalState();
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

</style>