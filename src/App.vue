<template>
  <h1>Hello Vue</h1>
  <button @click="useCam()">Click</button>
  <button @click="stop()">Stop</button>
  <video ref="inputVideo" autoplay muted id="videoin"></video>
  <div>Time in: {{timeIn}}</div>
</template>

<script>
import {checkApi} from "./sound-manager";
import {TimeManager} from "./time-manager"
import { mapGetters, mapActions } from 'vuex';
import mitt from 'mitt';
export default {
  name: "App",
  data() {
    return {
      video: null,
      webCamStream: null,
      canvas: null,
      emitter: null,
      timeManager: null,
    }
  },
  mounted() {
    // this.video = this.$refs.inputVideo;
    this.emitter = mitt();
    this.video = document.getElementById("videoin");
    console.log(typeof(this.video));
    console.log(this.video);
    const video2 = document.getElementById("videoin");
    console.log(typeof(video2));
    checkApi();
    this.emitter.on('update-time', (event) => {this.increaseTimeIn()});
    // this.timeManager = new TimeManager(this.video);
    // console.log(this.timeManager);
  },
  computed: {
    ...mapGetters([
        "timeIn"
    ])
  },
  methods: {
    ...mapActions([
      "increaseTimeIn"
    ]),
    async useCam() {
      this.webCamStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      this.video.srcObject = this.webCamStream;
      // this.canvas.srcObject = this.webCamStream;
      // console.log(this.timeManager);
      this.timeManager = new TimeManager(this.video, this.emitter);
      // console.log(timeManager);
      // this.increaseTimeIn(); // ok worked!
      await this.timeManager.loadModel();
      this.timeManager.start();
    }, 
    stop() {
      this.timeManager.stop();
    }
  }
}
</script>
