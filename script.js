function triggerLiveUpdate() {
  const status = document.getElementById('statusText');
  status.innerText = "Status: Live Update Triggered! ✅";

  setTimeout(() => {
    status.innerText = "Status: Waiting...";
  }, 3000);
}
