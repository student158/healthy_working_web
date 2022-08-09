<template>
  <h1>Healthy working</h1>
  <div id="image-user-state">
    <img :src="imgUserStateSource" width="150" height="150"/>
  </div>
  <div>
    <button @click="start()" class="btn btn-success" :disabled="appIsRunning">Start</button>
    <button @click="stop()" class="btn btn-danger" :disabled="!appIsRunning">Stop</button>
  </div>
  <div>
    <div v-if="userState === 'work'">
      <div>Worked:</div>
      <div class="progress">
            <div class="progress-bar" role="progressbar" aria-label="Basic example" :style="progressWorkBarPercentage" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
    <div v-else-if="userState === 'rest'">
      <div>Rested:</div>
      <div class="progress">
            <div class="progress-bar" role="progressbar" aria-label="Basic example" :style="progressRestBarPercentage" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
    <div v-else>
      <div>App is ready!</div>
    </div>
    <div>Time working: {{workTime/60}} mins</div>
    <div>Time rest: {{restTime/60}} mins</div>
    <button :disabled="appIsRunning" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Set up time</button>
    <TimeSetUpModal/>
  </div>
  <div>
    <label for="volume-slider">Volume: </label>
    <input type="range" min="0" max="100" id="volume-slider" @input="updateVolume" v-model="volumeVal">
    <span id="volume-value">{{volumeVal}} %</span>
  </div>
  <div style="position: absolute; visibility: hidden;" tabindex="-1" aria-hidden="true">
      <video ref="inputVideo" autoplay muted id="videoin"></video>
  </div>
  <!-- <div>Time in: {{timeIn}}</div> -->
</template>

<script>
import TimeSetUpModal from "./components/TimeSetUpModal.vue";
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
    data() {
        return {
            volumeVal: 15,
            imgUserStateSource: "/assets/notification_icon/ready.png",
        };
    },
    mounted() {
        this.video = this.$refs.inputVideo;
        // communicator with timeManager
        this.emitter = mitt();
        // this.video = document.getElementById("videoin");
        console.log(typeof (this.video));
        console.log(this.video);
        this.emitter.on("update-time", (event) => {
           // console.log("event from timeManager", event);
           this.updateTimeIn(event.timeIn); 
        });
        this.timeManager = new TimeManager(this.video, this.emitter, this.$store);
        // console.log(this.timeManager);
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
            "userState"
        ]),
        progressWorkBarPercentage() {
          const percentage = this.timeIn/this.workTime*100;
          return `width: ${percentage}%`;
        },
        progressRestBarPercentage() {
          const percentage = this.timeOut/this.restTime*100;
          return `width: ${percentage}%`;
        }
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
            // this.canvas.srcObject = this.webCamStream;
            // console.log(this.timeManager);
            // this.timeManager = new TimeManager(this.video, this.emitter);
            // console.log(timeManager);
            // this.increaseTimeIn(); // ok worked!
            await this.timeManager.loadModel();
            // this.timeManager.start();
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
        async updateVolume() {
            const currentVolume = parseFloat(this.volumeVal);
            console.log(currentVolume);
            console.log("type of currentVolume", typeof (currentVolume));
            this.timeManager.changeVolume(currentVolume);
        },
    },
    components: { TimeSetUpModal },
    watch: {
      workTime(newWorkTime, oldWorkTime) {
        console.log("newWorkTime", newWorkTime);
        console.log("type of newWorkTime", typeof(newWorkTime));
        this.timeManager.setAllowedWorkTime(parseFloat(newWorkTime));
      },
      restTime(newRestTime, oldRestTime) {
        this.timeManager.setSufficientRestTime(parseFloat(newRestTime));
      },
      userState(newUserState, oldUserState) {
        if (newUserState === "ready") {
            this.imgUserStateSource = "/assets/notification_icon/ready.png";
        } else if (newUserState === "work"){
            this.imgUserStateSource = "/assets/notification_icon/working.png";
        } else {
            this.imgUserStateSource = "/assets/notification_icon/exercise.png";
        }
      }
    }
}
</script>
