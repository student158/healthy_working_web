<template>
  <div class="app container text-center border border-2 mt-5">
    <NavBar />
    <UserStateImage />
    <div class="mt-3">
      <button @click="start()" class="btn btn-success" :disabled="appIsRunning">Start</button>
      <button @click="stop()" class="btn btn-danger" :disabled="!appIsRunning">Stop</button>
    </div>
    <WorkRestProgressBar/>
    <TimeSetUpPane/>
    <NotificationVolumeSlider/>
    <div style="position: absolute; visibility: hidden;" tabindex="-1" aria-hidden="true">
        <video ref="inputVideo" autoplay muted id="videoin"></video>
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import TimeSetUpPane from "./components/TimeSetUpPane.vue";
import UserStateImage from "./components/UserStateImage.vue";
import WorkRestProgressBar from "./components/WorkRestProgressBar.vue";
import NotificationVolumeSlider from "./components/NotificationVolumeSlider.vue";
import {TimeManager} from "./time-manager"
import { mapGetters, mapActions } from 'vuex';
import mitt from 'mitt';
export default {
    name: "App",
    video: null,
    webCamStream: null,
    canvas: null,
    emitter: null,
    timeManager: null,
    worker: null,
    mounted() {
        this.video = this.$refs.inputVideo;
        // communicator with timeManager
        this.emitter = mitt();
        this.emitter.on("update-time", (event) => {
           this.updateTimeIn(event.timeIn); 
        });
        this.timeManager = new TimeManager(this.video, this.emitter, this.$store);
        this.worker = new Worker("/worker.js");
        this.worker.onmessage = async (event) => {
            await this.timeManager.start();
            this.worker.postMessage(["start"]);
        };
    },
    computed: {
        ...mapGetters([
            "timeIn",
            "timeOut",
            "appIsRunning",
            "workTime",
            "restTime",
            "userState",
            "notificationVolume"
        ]),
    },
    methods: {
        ...mapActions([
            "updateTimeIn",
            "appTurnOff",
            "appTurnOn",
            "updateWorkTime",
            "updateRestTime",
            "changeUserStateToWork",
            "changeUserStateToReady",
            "resetTimeInOut"
        ]),
        async start() {
            this.webCamStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            this.video.srcObject = this.webCamStream;
            await this.timeManager.loadModel();
            this.worker.postMessage(["start"]);
            this.changeUserStateToWork();
            this.appTurnOn();
        },
        stop() {
            const tracks = this.webCamStream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            this.worker.postMessage(["stop"]);
            this.timeManager.stop();
            this.imgUserStateSource = "/assets/notification_icon/ready.png";
            this.changeUserStateToReady();
            this.resetTimeInOut();
            this.appTurnOff();
        },
    },
    components: { 
      UserStateImage, 
      WorkRestProgressBar,
      TimeSetUpPane,
      NotificationVolumeSlider,
      NavBar
    },
    watch: {
      workTime(newWorkTime, oldWorkTime) {
        console.log("newWorkTime", newWorkTime);
        console.log("type of newWorkTime", typeof(newWorkTime));
        this.timeManager.setAllowedWorkTime(parseFloat(newWorkTime));
      },
      restTime(newRestTime, oldRestTime) {
        this.timeManager.setSufficientRestTime(parseFloat(newRestTime));
      },
      notificationVolume(newVolume, oldVolume) {
        this.timeManager.changeVolume(newVolume);
      }
    }
}
</script>

<style>
.app {
  width: 45%;
}
</style>