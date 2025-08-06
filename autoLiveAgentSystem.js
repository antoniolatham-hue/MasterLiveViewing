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
