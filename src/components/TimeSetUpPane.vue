<template>
    <div class="time-set-up-pane border border-primary">
        <div>Time working: {{workTime/60}} mins</div>
        <div>Time rest: {{restTime/60}} mins</div>
        <button :disabled="appIsRunning" class="btn btn-primary mb-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Set up time</button>
        <TimeSetUpModal/>
    </div>
</template>

<script>
import TimeSetUpModal from "./TimeSetUpModal.vue";
import { mapGetters } from 'vuex';
export default {
    name: "TimeSetUpPane",
    computed: {
        ...mapGetters([
            "appIsRunning",
            "workTime",
            "restTime",
        ]),
    },
    components: { 
      TimeSetUpModal,
    },
}
</script>

<style>
.time-set-up-pane {
    width: 45%;
    margin: 0 auto;
}
</style>