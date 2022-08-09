<template>
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
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: "WorkRestProgressBar",
    computed: {
        ...mapGetters([
            "timeIn",
            "timeOut",
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
}
</script>