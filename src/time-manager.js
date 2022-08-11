import {SoundManager} from "./sound-manager";

export class TimeManager {
    timeManagerOperationState = "paused";
    state = "can-work"; // or "need-rest"
    allowedWorkTime = 25*60; // default is 20 mins
    sufficientRestTime = 5*60;
    timeIn = 0;
    timeOut = 0;
    soundManager = new SoundManager();

    standUpNotification;
    canContinueNotification;
    standUpNotificationIsShown = false;
    canContinueNotificationIsShown = false;
    // after the app notify, if the user stand up and move outside -> change to true
    standUpNotificationDisappeared = false;

    faceDetectionModelFolderPath = "/face-api/models";

    // sendOperationDataToDocumentEvent;
    // sendOperationDataToDocumentEventName = "fromTimeManager-sendData";

    // ID of setInterval method, use when stop the time manager
    timeManagerSessionId;

    timeInterval = 1000;

    engineIsRunning = true;

    elapseSpeed = 1;

    /**Track time user sit, trigger notification */
    constructor(webcamData, emitter, appStore) {
        this.webcamData = webcamData;
        this.emitter = emitter;
        this.appStore = appStore;
        // console.log("appStore: ", appStore);
        document.addEventListener('visibilitychange', (event) => {this.checkTabFocused()});
    }

    checkTabFocused() {
        if (document.visibilityState === 'visible') {
          console.log('✅ browser tab has focus');
          this.elapseSpeed = 1;
        } else {
          console.log('⛔️ browser tab does NOT have focus');
          this.elapseSpeed = 2.4;
        }
    }

    async loadModel() {
        await faceapi.loadTinyFaceDetectorModel(this.faceDetectionModelFolderPath);
    }

    async detectFace() {
        // this.sendOperationDataToDocument();
        // console.log(faceapi);
        // console.log("this.webcamdata", this.webcamData);
        // let faceDetections = await faceapi.detectAllFaces("123");
        let faceDetections = await faceapi.detectAllFaces(this.webcamData, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }));
        let faceIsDetected = faceDetections.length >= 1;
        if (this.state === "can-work") {
            if (faceIsDetected) {
                this.timeIn += this.elapseSpeed;
                this.timeOut = 0;
                // console.log("time in: ", this.timeIn, "time out: ", this.timeOut);

                if (this.timeIn >= this.allowedWorkTime) {
                    this.state = "need-rest";
                    this.appStore.dispatch("changeUserStateToRest");
                    this.timeOut = 0;
                    // reset variable in the need-rest case
                    this.standUpNotificationIsShown = false;
                    this.standUpNotificationDisappeared = false;
                }
                // first time return to desk after stand up
                if (this.canContinueNotificationIsShown) {
                    this.canContinueNotificationIsShown = false;
                    // after user return to desk, after 3 secs the notification disappear
                    setTimeout(() => {this.hideCanWorkNotification();}, 3000);
                    // reset timeout when first time return to desk
                    this.timeOut = 0;
                }
            } else {
                this.timeOut += this.elapseSpeed;
                // console.log("time in: ", this.timeIn, "time out: ", this.timeOut);
                // can work is actually set the timeIn to 0. If healthy + rest enough -> timeIn 0 again
                if (this.timeOut >= this.sufficientRestTime) {
                    this.timeIn = 0;
                }
            }
        } 
        else { //when this.state is "need-rest"
            if (faceIsDetected) {
                this.timeIn += this.elapseSpeed;
                // console.log("time in: ", this.timeIn, "time out: ", this.timeOut);
                if (!this.standUpNotificationIsShown) {
                    this.showStandUpNotification();
                    this.standUpNotificationIsShown = true;
                }
                this.soundManager.notifyStandUp();
            } 
            else {
                this.timeOut += this.elapseSpeed;
                // console.log("time in: ", this.timeIn, "time out: ", this.timeOut);
                if (this.standUpNotificationIsShown && !this.standUpNotificationDisappeared && this.timeOut >= 5) {
                    setTimeout(() => {
                        this.hideStandUpNotification();
                    }, 500);
                    this.standUpNotificationDisappeared = true;
                }
                if (this.timeOut >= this.sufficientRestTime) {
                    this.state = "can-work";
                    this.appStore.dispatch("changeUserStateToWork");
                    this.timeIn = 0;
                    this.showCanWorkNotification();
                    this.canContinueNotificationIsShown = true;
                }
            }
        }
        this.appStore.dispatch("updateTimeIn", this.timeIn);
        this.appStore.dispatch("updateTimeOut", this.timeOut);
        // this.emitter.emit("update-time", {timeIn: this.timeIn});

    }

    sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    }

    async start() {
        this.engineIsRunning = true;
        this.timeManagerOperationState = "running";
        // this.timeManagerSessionId = setInterval(() => {
        //     this.detectFace();
        // }, 1000);
        // console.log("This method runs");
        await this.detectFace();
        // await this.sleep(this.timeInterval);
        console.log("time in", this.timeIn);
        console.log("time out", this.timeOut);
}

    // async start() {
    //     // this.timeManagerOperationState = "running";
    //     // this.timeManagerSessionId = setInterval(() => {
    //     //     this.detectFace();
    //     // }, 1000);
    //     console.log("This method runs");
    //     await this.detectFace();
    //     await this.sleep(1000);
    //     console.log("time in", this.timeIn);
    //     console.log("time out", this.timeOut);
    //     window.requestAnimationFrame(this.start);
        
    // }

    // start2() {
    //     this.timeManagerOperationState = "running";
    //     window.requestAnimationFrame(this.start);
    // }

    /**Stop and reset all the variables */
    stop() {
        // clearInterval(this.timeManagerSessionId);
        this.engineIsRunning = false;
        this.timeIn = 0;
        this.timeOut = 0;
        this.state = "can-work";
        try {
            this.standUpNotification.close();
        }
        catch(err) {};
        try {
            this.canContinueNotification.close();
        }
        catch(err) {};
        this.standUpNotification = null;
        this.canContinueNotification = null;
        this.standUpNotificationIsShown = false;
        this.canContinueNotificationIsShown = false;
        this.standUpNotificationDisappeared = false;
    }

    // sendOperationDataToDocument() {
    //     const data = {
    //         state: this.state,
    //         timeIn: this.timeIn,
    //         timeOut: this.timeOut,
    //         allowedWorkTime: this.allowedWorkTime,
    //         sufficientRestTime: this.sufficientRestTime
    //     }
    //     this.sendOperationDataToDocumentEvent = new CustomEvent(this.sendOperationDataToDocumentEventName, {detail: data});
    //     document.dispatchEvent(this.sendOperationDataToDocumentEvent);
    // }

    /**allowedWorkTime: float, in secs */
    setAllowedWorkTime(allowedWorkTime) {
        this.allowedWorkTime = allowedWorkTime;
    }

    /**sufficientRestTime: float, in secs
     * @param sufficientRestTime float, in secs
     */
    setSufficientRestTime(sufficientRestTime) {
        this.sufficientRestTime = sufficientRestTime;
    }

    hideCanWorkNotification() {
        //window.api.hideCanWorkNotification();
        this.canContinueNotification.close();
    }
    
    showCanWorkNotification() {
        //window.api.showCanWorkNotification();
        this.canContinueNotification = new Notification("✔ You can continue working!", {requireInteraction: true, icon: "/assets/notification_icon/working.png", body: "(Auto hide when user continues working)"});
    }
    
    showStandUpNotification() {
        //window.api.showStandupNotification();
        this.standUpNotification = new Notification("⚠ You should stand up!!!", {requireInteraction: true, icon: "/assets/notification_icon/exercise.png", body: "(Auto hide when user leaves table)"});
    }

    hideStandUpNotification() {
        this.standUpNotification.close();
    }

    /**
     * @param value float, scale 100 */
    changeVolume(value) {
        this.soundManager.changeVolume(value);
    }

}