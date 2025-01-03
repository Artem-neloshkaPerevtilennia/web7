const playButton = document.getElementById("play");
const startButton = document.getElementById("start");
const workDiv = document.getElementById("work");
const animDiv = document.getElementById("anim");
const circle = document.getElementById("circle");
const messagesDiv = document.getElementById("messages");

let animationInterval;
let circlePosition = { top: 0, left: 0 };
let velocity = { x: 2, y: 2 };

playButton.addEventListener("click", () => {
  const stopButton = document.createElement("button");
  stopButton.id = "close";
  stopButton.textContent = "Close";

  stopButton.addEventListener("click", () => {
    workDiv.style.display = "none";
    logMessage("Work area hidden.");
    stopButton.remove();
  });

  document.querySelector(".buttons").appendChild(stopButton);
  workDiv.style.display = "block";
  logMessage("Work area displayed.");
});

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  createStopButton();
  startAnimation();
});

function createStopButton() {
  const stopButton = document.createElement("button");
  stopButton.id = "stop";
  stopButton.textContent = "Stop";
  stopButton.addEventListener("click", () => {
    stopAnimation();
    startButton.style.display = "block";
    stopButton.remove();
  });
  document.querySelector(".buttons").appendChild(stopButton);
}

function startAnimation() {
  logMessage("Animation started.");
  animationInterval = setInterval(() => {
    circlePosition.top += velocity.y;
    circlePosition.left += velocity.x;

    if (
      circlePosition.top <= 0 ||
      circlePosition.top >= animDiv.clientHeight - circle.offsetHeight
    ) {
      velocity.y = -velocity.y;
    }

    if (circlePosition.left >= animDiv.clientWidth - circle.offsetWidth) {
      logMessage("Circle exited anim area.");
      stopAnimation();
      createReloadButton();
      return;
    }

    circle.style.top = `${circlePosition.top}px`;
    circle.style.left = `${circlePosition.left}px`;
  }, 30);
}

function stopAnimation() {
  clearInterval(animationInterval);
  logMessage("Animation stopped.");
}

function createReloadButton() {
  const reloadButton = document.createElement("button");
  reloadButton.id = "reload";
  reloadButton.textContent = "Reload";
  reloadButton.addEventListener("click", () => {
    circlePosition = { top: 0, left: 0 };
    velocity = { x: 2, y: 2 };
    circle.style.top = "0px";
    circle.style.left = "0px";
    reloadButton.remove();
    const closeButton = document.getElementById("stop");
    closeButton.remove();
    startButton.style.display = "block";
    logMessage("Animation reset.");
  });
  document.querySelector(".buttons").appendChild(reloadButton);
}

function logMessage(message) {
  const time = new Date().toLocaleTimeString();
  const logEntry = document.createElement("p");
  logEntry.textContent = `[${time}] ${message}`;
  messagesDiv.appendChild(logEntry);
}
