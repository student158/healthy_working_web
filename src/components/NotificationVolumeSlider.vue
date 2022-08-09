<template>
    <div>
        <label for="volume-slider">Volume: </label>
        <input type="range" min="0" max="100" id="volume-slider" @input="updateVolume" v-model="volumeVal">
        <span id="volume-value">{{volumeVal}} %</span>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: "NotificationVolumeSlider",
    data() {
        return {
            volumeVal: 15,
        };
    },
    props: ["timeManager"],
    methods: {
        ...mapActions([
            "updateNotificationVolume",
        ]),
        async updateVolume() {
            const currentVolume = parseFloat(this.volumeVal);
            // console.log(currentVolume);
            // console.log("type of currentVolume", typeof (currentVolume));
            this.updateNotificationVolume(currentVolume);
            // this.timeManager.changeVolume(currentVolume);
        },
    },
}
</script>
