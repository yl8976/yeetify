const firestore = firebase.firestore();
const settings = {/* Settings for more complex Firestore configs... */ timestampsInSnapshots: true};
firestore.settings(settings);

// Note to self: collections come first
const docRef = firestore.doc("data/yeetCounter");
const header = document.querySelector("#header");
const yeetifier = document.querySelector("#yeetifier");
const counter = document.querySelector("#counter");

// Load clipboard.js
var clipboard = new ClipboardJS('#copy-button');

// Main Button Functionality
yeetifier.addEventListener("click", function () {
    // Grab input and display box
    var input = document.getElementById("yeet-input").value;
    document.getElementById("result").style.display = "block";
    document.getElementById("result-box").style.display = "block";

    // Check for blank inputs
    if (input === "") {
        // Display error
        document.getElementById("result").innerHTML = "You haven't written anything!";

        // Hide copy button if visible from previous use
        document.getElementById("copy-button").style.display = "none";
    } else {
        // Display result and copy button
        document.getElementById("result").innerHTML = input + " YEET";
        document.getElementById("copy-button").style.display = "inline-flex";

        // Read current counter value
        var currentCount = parseInt(counter.innerHTML);

        // Check if counter has been initialized
        if (isNaN(currentCount)) {
            currentCount = 0;
        }

        // Save data to Firestore
        docRef.set({
            clickNumber: ++currentCount,
        }).then(function () {
            console.log("Status saved!");
        }).catch(function (error) {
            console.log("Got an error: ", error);
        });
    }

    // Reset values
    document.getElementById("yeet-input").value = "";
    document.getElementById("copy-button").innerHTML = "Copy Text";
})

// Realtime Updates from Firestore
getRealTimeUpdates = function () {
    docRef.onSnapshot(function (doc) {
        if (doc && doc.exists) {
            const myData = doc.data();
            document.getElementById("counter").innerHTML = myData.clickNumber;
        }
    });
}

getRealTimeUpdates();

// Copy YEETified text to clipboard
clipboard.on('success', function (e) {
    e.clearSelection();
    document.getElementById("copy-button").innerHTML = "Copied!";
});