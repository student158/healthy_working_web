<template>
    <div>Time working: {{workTime/60}} mins</div>
    <div>Time rest: {{restTime/60}} mins</div>
    <button :disabled="appIsRunning" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Set up time</button>
    <TimeSetUpModal/>
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
