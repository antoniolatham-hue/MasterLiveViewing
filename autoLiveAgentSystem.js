/* 
  autoLiveAgentSystem.js 
  Folder: /auto_live_monitor/ or root
  Purpose:
    ✅ Auto-redirect all agents to live dashboard
    ✅ Template to create future agents
    ✅ Keeps view live no matter what agent runs
*/

// ======== Base Agent Function ========
function runAgent(agentName, taskCallback) {
  console.log(`[${agentName}] is running...`);

  // Execute custom task if provided
  if (typeof taskCallback === "function") {
    taskCallback();
  }

  // Always go to live dashboard
  window.location.href = "/live_dashboard/LiveAgentDashboard.html";
}

// ======== Example Agent: PowerAgent ========
const powerAgent = () => runAgent("PowerAgent", () => {
  console.log("✅ Power systems checked");
});

// ======== Example Agent: BatteryAgent ========
const batteryAgent = () => runAgent("BatteryAgent", () => {
  console.log("🔋 Battery status synced");
});

// ======== Example Agent: AudioSyncAgent ========
const audioSyncAgent = () => runAgent("AudioSyncAgent", () => {
  console.log("🎵 Audio synced with timeline");
});

// ======== Choose Which Agent to Run ========
// Uncomment only ONE line below at a time to test:

powerAgent();
// batteryAgent();
// audioSyncAgent();

/* 
  autoLiveAgentSystem.js 
  Purpose:
    ✅ Auto-run all agents in sync
    ✅ Log last running agent to dashboard
    ✅ No manual edits needed — runs automatically
*/

// ======== Base Runner Function ========
function runAgent(agentName, taskCallback) {
  console.log(`[${agentName}] is running...`);

  // Optional: Do task
  if (typeof taskCallback === "function") {
    taskCallback();
  }

  // Save to dashboard view
  localStorage.setItem("lastAgentRun", agentName);

  // Redirect to live dashboard
  window.location.href = "/live_dashboard/LiveAgentDashboard.html";
}

// ======== Agent Definitions ========
const powerAgent = () => runAgent("PowerAgent", () => {
  console.log("✅ Power systems checked");
});

const batteryAgent = () => runAgent("BatteryAgent", () => {
  console.log("🔋 Battery level synced");
});

const audioSyncAgent = () => runAgent("AudioSyncAgent", () => {
  console.log("🎵 Audio synced to timeline");
});

const wifiAgent = () => runAgent("WifiAgent", () => {
  console.log("📡 WiFi connected and verified");
});

const gpsAgent = () => runAgent("GPSAgent", () => {
  console.log("📍 GPS location updated");
});

const tempSensorAgent = () => runAgent("TempSensorAgent", () => {
  console.log("🌡️ Temperature sensors scanned");
});

// ======== Auto-Sync All Agents Here ========
const autoSyncAgents = [
  powerAgent,
  batteryAgent,
  audioSyncAgent,
  wifiAgent,
  gpsAgent,
  tempSensorAgent
];

let syncDelay = 1000; // 1 second delay between agents

autoSyncAgents.forEach((agent, index) => {
  setTimeout(() => {
    agent();
  }, syncDelay * index);
});
