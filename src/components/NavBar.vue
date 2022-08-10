<template>
    <nav class="navbar">
        <a class="navbar-brand">
            <img class="mt-1" src="/assets/images/logo.png" width="170" height="40">
        </a>
        <ul class="nav justify-content-end">
            <li class="nav-item">
                <button class="btn about-btn" title="About this app"><a href="https://github.com/student158/healthy_working_web" target="_blank"><img src="/assets/images/about_icon.png" width="20" height="20"></a></button>
            </li>
            <li class="nav-item">
                <button class="btn" title="Settings" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="turnOnCamAdjModal()"><img src="/assets/images/settings_icon.png" width="20" height="20"></button>
            </li>
        </ul>
        <CameraAdjustmentModal/>
    </nav>
</template>

<script>
import CameraAdjustmentModal from './CameraAdjustmentModal.vue';
import { mapGetters, mapActions } from 'vuex';
export default {
    name: "NavBar",
    components: {
        CameraAdjustmentModal,
    },
    methods: {
        ...mapActions([
            "updateCamAdjustmentModalState",
        ]),
        turnOnCamAdjModal() {
            this.updateCamAdjustmentModalState();
        }
    }
}
</script>