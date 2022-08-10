<template>
    <div class="work-rest-progress-bar mt-3 mb-3">
        <div v-if="userState === 'work'">
            <div>Working:</div>
            <div class="progress">
                <div class="progress-bar bg-warning" role="progressbar" :style="progressWorkBarPercentage" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
        <div v-else-if="userState === 'rest'">
            <div>Resting:</div>
            <div class="progress">
                <div class="progress-bar bg-success" role="progressbar" :style="progressRestBarPercentage" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
        <div v-else>
            <div>App is ready!</div>
        </div>
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

<style>
.work-rest-progress-bar {
    width: 45%;
    margin: 0 auto;
}
</style>