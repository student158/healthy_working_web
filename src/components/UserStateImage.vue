<template>
    <div id="image-user-state">
        <img :src="imgUserStateSource" width="150" height="150" :class="imgBorder"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: "UserStateImage",
    data() {
        return {
            imgUserStateSource: "/assets/notification_icon/ready.png",
            imgBorder: "",
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
            this.imgBorder = "";
        } else if (newUserState === "work"){
            this.imgUserStateSource = "/assets/notification_icon/working.png";
            this.imgBorder = "border border-success rounded border-5";
        } else {
            this.imgUserStateSource = "/assets/notification_icon/exercise.png";
            this.imgBorder = "border border-warning rounded border-5";
        }
      }
    }
}
</script>