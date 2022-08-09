let detected = false;

console.log("Run worker successfully");

onmessage = (event) => {
    // console.log("Received command from UI");
    if (event.data[0] === "start") {
        detected = true;
    }
    if (event.data[0] === "stop") {
        detected = false;
    }
}

setInterval(() => {
    if (detected) {
        // console.log("Image detected!");
        postMessage("detect-image");
        detected = false;
    }
}, 1000);