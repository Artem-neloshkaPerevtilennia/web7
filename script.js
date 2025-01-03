const playButton = document.getElementById("play");
const startButton = document.getElementById("start");
const workDiv = document.getElementById("work");
const animDiv = document.getElementById("anim");
const circle = document.getElementById("circle");
const messagesDiv = document.getElementById("messages");

let animationInterval;
let circlePosition = { top: 0, left: 0 };
let velocity = { x: 2, y: 2 };

function saveEventToLocal(eventType, message) {
  const eventId = (localStorage.length + 1).toString();
  const eventData = JSON.stringify({ eventType, message, time: new Date().toISOString() });
  localStorage.setItem(eventId, eventData);
  console.log("Event saved to LocalStorage:", eventId, eventData);
}

async function sendEventToServer(eventType, message) {
  const eventData = { eventType, message, time: new Date().toString() };

  await fetch('https://web7api.onrender.com/api/save', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  })
    .then(response => response.json())
    .then(data => console.log("Event sent to server:", data))
    .catch(error => console.error("Error sending event:", error));
}

async function logEvent(eventType, message) {
  saveEventToLocal(eventType, message);
  await sendEventToServer(eventType, message);
}

async function logMessage(message) {
  await logEvent("message_log", message);

  const time = new Date().toLocaleTimeString();

  let table = document.querySelector("#eventsTable");
  if (!table) {
    table = document.createElement("table");
    table.id = "eventsTable";
    table.style.border = "1px solid black";
    table.style.width = "100%";
    table.style.fontSize = "12px";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "20px";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Local Events", "Server Events"];
    headers.forEach(header => {
      const th = document.createElement("th");
      th.textContent = header;
      th.style.border = "1px solid black";
      th.style.padding = "8px";
      th.style.backgroundColor = "#f2f2f2";
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.id = "eventsBody";
    table.appendChild(tbody);

    messagesDiv.appendChild(table);
  }

  const tbody = document.querySelector("#eventsBody");

  const localData = `[${time}] ${message}`;
  const row = document.createElement("tr");

  const localCell = document.createElement("td");
  localCell.textContent = localData;
  localCell.style.border = "1px solid black";
  localCell.style.padding = "8px";
  row.appendChild(localCell);

  const serverCell = document.createElement("td");
  serverCell.style.border = "1px solid black";
  serverCell.style.padding = "8px";

  tbody.appendChild(row);

  await fetch('https://web7api.onrender.com/api/get')
        .then(response => response.json())
        .then(records => {
            console.log(records);
            serverCell.textContent = JSON.stringify(records);
        })
        .catch(error => console.error('Error loading objects:', error));

  row.appendChild(serverCell);
}

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
  logMessage("Work area displayed."); // не робе
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
  animationInterval = setInterval(async () => {
    circlePosition.top += velocity.y;
    circlePosition.left += velocity.x;

    if (
      circlePosition.top <= 0 ||
      circlePosition.top >= animDiv.clientHeight - circle.offsetHeight
    ) {
      velocity.y = -velocity.y;
    }

    if (circlePosition.left >= animDiv.clientWidth - circle.offsetWidth) {
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
  logMessage("Circle exited anim area.");
}

function createReloadButton() {
  const reloadButton = document.createElement("button");
  reloadButton.id = "reload";
  reloadButton.textContent = "Reload";
  reloadButton.addEventListener("click", async () => {
    circlePosition = { top: 0, left: 0 };
    velocity = { x: 2, y: 2 };
    circle.style.top = "0px";
    circle.style.left = "0px";
    reloadButton.remove();
    const closeButton = document.getElementById("stop");
    closeButton.remove();
    startButton.style.display = "block";
    await logMessage("Animation reset."); // не робе
  });
  document.querySelector(".buttons").appendChild(reloadButton);
}

async function loadEventsFromLocalStorage() {
  const recordsFromServer = [];
  const recordsFromLocal = [];

  await fetch('https://web7api.onrender.com/api/get')
    .then(response => response.json())
    .then(records => {
      console.log(records);
      recordsFromServer.push(...records);
    })
    .catch(error => console.error('Error loading objects:', error));

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    recordsFromLocal.push({ id: key, message: value });
  }

  console.log("Loaded LocalStorage Events:", recordsFromLocal);
  console.log("Loaded Server Events:", recordsFromServer);
}