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
    document.getElementById("result").style.display = "Inherit";
    document.getElementById("result-box").style.display = "Inherit";

    // Check for blank inputs
    if (input === "") {
        document.getElementById("result").innerHTML = "You haven't written anything!";
    } else {
        document.getElementById("result").innerHTML = input + " YEET";

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


// function copy() {
//     const el = document.createElement('textarea');
//     el.value = document.getElementById("result").innerHTML;
//     el.setAttribute('readonly', '');
//     el.style.position = 'absolute';
//     el.style.left = '-9999px';
//     document.body.appendChild(el);
//     el.select();
//     document.execCommand('copy');
//     document.body.removeChild(el);
//     document.getElementById("copy-button").innerHTML = "Copied!";
//     
// }