import {createStore} from 'vuex';

const state = {
    timeIn: 0,
    timeOut: 0,
    appIsRunning: false,
    workTime: 25*60,
    restTime: 5*60,
    userState: "ready", // ready | work | rest
    notificationVolume: 15,
    camAdjustmentModalState: "off", // off | on
};

const mutations = {
    UPDATE_TIME_IN(state, payload) {
        state.timeIn = payload;
    }, 
    UPDATE_TIME_OUT(state, payload) {
        state.timeOut = payload;
    }, 
    RESET_TIME_IN_OUT(state) {
        state.timeIn = 0;
        state.timeOut = 0;
    },
    UPDATE_NOTIFICATION_VOLUME(state, payload) {
        state.notificationVolume = payload;
    },
    TURN_OFF(state) {
        state.appIsRunning = false;
    },
    TURN_ON(state) {
        state.appIsRunning = true;
    },
    UPDATE_WORK_TIME(state, payload) {
        state.workTime = payload;
    },
    UPDATE_REST_TIME(state, payload) {
        state.restTime = payload;
    },
    CHANGE_USER_STATE_TO_READY(state) {
        state.userState = "ready";
    },
    CHANGE_USER_STATE_TO_WORK(state) {
        state.userState = "work";
    },
    CHANGE_USER_STATE_TO_REST(state) {
        state.userState = "rest";
    },
    UPDATE_CAM_ADJUSTMENT_MODAL_STATE(state) {
        if (state.camAdjustmentModalState === "off") {
            state.camAdjustmentModalState = "on";
        }
        else {
            state.camAdjustmentModalState = "off";
        }
    }
};

const actions = {
    updateTimeIn({commit}, timeIn) {
        commit("UPDATE_TIME_IN", timeIn);
    },
    updateTimeOut({commit}, timeOut) {
        commit("UPDATE_TIME_OUT", timeOut);
    },
    resetTimeInOut({commit}) {
        commit("RESET_TIME_IN_OUT");
    },
    updateNotificationVolume({commit}, volumeVal) {
        commit("UPDATE_NOTIFICATION_VOLUME", volumeVal);
    },
    appTurnOff({commit}) {
        commit("TURN_OFF");
    },
    appTurnOn({commit}) {
        commit("TURN_ON");
    },
    updateWorkTime({commit}, newWorkTime) {
        commit("UPDATE_WORK_TIME", newWorkTime);
    },
    updateRestTime({commit}, newRestTime) {
        commit("UPDATE_REST_TIME", newRestTime);
    },
    changeUserStateToReady({commit}) {
        commit("CHANGE_USER_STATE_TO_READY");
    },
    changeUserStateToWork({commit}) {
        commit("CHANGE_USER_STATE_TO_WORK");
    },
    changeUserStateToRest({commit}) {
        commit("CHANGE_USER_STATE_TO_REST");
    },
    updateCamAdjustmentModalState({commit}) {
        commit("UPDATE_CAM_ADJUSTMENT_MODAL_STATE");
    },
};

const getters = {
    timeIn: (state) => state.timeIn,
    timeOut: (state) => state.timeOut,
    appIsRunning: (state) => state.appIsRunning,
    workTime: (state) => state.workTime,
    restTime: (state) => state.restTime,
    userState: (state) => state.userState,
    notificationVolume: (state) => state.notificationVolume,
    camAdjustmentModalState: (state) => state.camAdjustmentModalState,
}

const store = createStore({
    state,
    mutations,
    actions,
    getters
});

export default store;