<template>
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Set up time</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div>Input work time:
                <input class="w-25" v-model="userSetWorkMins"/> mins 
                <input class="w-25" v-model="userSetWorkSecs"/> secs
            </div>
            <div>Input rest time:
                <input class="w-25" v-model="userSetRestMins"/> mins 
                <input class="w-25" v-model="userSetRestSecs"/> secs
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="saveSetupTime()">Save</button>
        </div>
        </div>
    </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
export default {
    name: "TimeSetUpModal",
    computed: {
        ...mapGetters([
            "timeIn",
            "appIsRunning",
            "workTime",
            "restTime",
        ])
    },
    data() {
        return {
            userSetWorkMins: 0,
            userSetWorkSecs: 0,
            userSetRestMins: 0,
            userSetRestSecs: 0,
        }
    },
    mounted() {
        this.userSetWorkMins = this.workTime/60;
        this.userSetRestMins = this.restTime/60;
    },
    methods: {
        ...mapActions([
            "increaseTimeIn",
            "appTurnOff",
            "appTurnOn",
            "updateWorkTime",
            "updateRestTime"
        ]),
        saveSetupTime() {
            this.updateWorkTime(this.userSetWorkMins*60 + this.userSetWorkSecs);
            this.updateRestTime(this.userSetRestMins*60 + this.userSetRestSecs);
        }
    }
}
</script>