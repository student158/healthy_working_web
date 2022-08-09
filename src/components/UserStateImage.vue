<template>
    <div id="image-user-state">
        <img :src="imgUserStateSource" width="150" height="150"/>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: "UserStateImage",
    data() {
        return {
            imgUserStateSource: "/assets/notification_icon/ready.png",
        };
    },
    computed: {
        ...mapGetters([
            "userState"
        ]),
    },
    watch: {
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