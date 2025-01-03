let eventsTable;

function createTableIfNotExists() {
  if (eventsTable) return eventsTable;

  const table = document.createElement("table");
  table.id = "eventsTable";
  table.style.border = "1px solid black";
  table.style.width = "100%";
  table.style.fontSize = "12px";
  table.style.borderCollapse = "collapse";
  table.style.marginTop = "20px";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Local Events", "Server Events"];
  headers.forEach((header) => {
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
  eventsTable = table;

  return table;
}

async function logMessage(message) {
  await logEvent("message_log", message);

  const time = new Date().toLocaleTimeString();
  const table = createTableIfNotExists();
  const tbody = table.querySelector("#eventsBody");

  const row = document.createElement("tr");

  const localCell = document.createElement("td");
  localCell.textContent = `[${time}] ${message}`;
  localCell.style.border = "1px solid black";
  localCell.style.padding = "8px";
  row.appendChild(localCell);

  const serverCell = document.createElement("td");
  serverCell.style.border = "1px solid black";
  serverCell.style.padding = "8px";
  row.appendChild(serverCell);
  tbody.appendChild(row);

  try {
    const response = await fetch("https://web7api.onrender.com/api/get");
    if (!response.ok) throw new Error("Failed to fetch server data");
    const records = await response.json();
    serverCell.textContent = records.message || "No server message";
  } catch (error) {
    serverCell.textContent = "Error loading server data.";
    console.error("Error fetching server data:", error);
  }
}

async function startAnimation() {
  await logMessage("Animation started.");
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
      clearInterval(animationInterval);
      logMessage("Circle exited anim area.");
      stopAnimation();
      createReloadButton();
      return;
    }

    circle.style.top = `${circlePosition.top}px`;
    circle.style.left = `${circlePosition.left}px`;
  }, 30);
}

function loadEventsFromLocalStorage() {
  const recordsFromLocal = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    recordsFromLocal.push({ id: key, message: value });
  }
  console.log("Loaded LocalStorage Events:", recordsFromLocal);
}