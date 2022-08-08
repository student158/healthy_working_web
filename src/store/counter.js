import {createStore} from 'vuex';

const state = {
    timeIn: 0
};

const mutations = {
    UPDATE_TIME_IN(state) {
        state.timeIn = state.timeIn + 1;
    }
};

const actions = {
    increaseTimeIn({commit}) {
        commit("UPDATE_TIME_IN");
    }
};

const getters = {
    timeIn: (state) => state.timeIn
}

const store = createStore({
    state,
    mutations,
    actions,
    getters
});

export default store;