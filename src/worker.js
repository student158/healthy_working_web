let detected = false;

console.log("Run worker successfully");

onmessage = (event) => {
    // console.log("Received command from UI");
    detected = true;
}

setInterval(() => {
    if (detected) {
        // console.log("Image detected!");
        postMessage("detect-image");
        detected = false;
    }
}, 1000);