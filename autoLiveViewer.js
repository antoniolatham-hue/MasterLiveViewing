// autoLiveViewer.js

const fs = require('fs');
const path = require('path');

// SETTINGS
const appsDir = path.join(__dirname, 'MyPhoneApps'); // Folder with your apps
const baseURL = "https://antonioLatham-hue.github.io/MyPhoneApps"; // Change if needed

const outputJSON = path.join(__dirname, 'liveMonitor.json');
const outputHTML = path.join(__dirname, 'live-viewer.html');

// STEP 1: Auto-Scan App Folders
const apps = fs.readdirSync(appsDir)
  .filter(name => fs.lstatSync(path.join(appsDir, name)).isDirectory())
  .map(name => ({
    name,
    url: `${baseURL}/${name}`,
    status: 'Live',
    category: 'Auto'
  }));

// STEP 2: Create liveMonitor.json
fs.writeFileSync(outputJSON, JSON.stringify({ apps }, null, 2));
console.log("✅ liveMonitor.json created.");

// STEP 3: Generate live-viewer.html with inline JS
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>MasterLiveViewing</title>
  <style>
    body { font-family: Arial, sans-serif; background: #111; color: #fff; padding: 20px; }
    h1 { text-align: center; color: #00ffcc; }
    .app-list { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
    .app-card { background: #222; border: 1px solid #444; padding: 16px; border-radius: 10px; width: 260px; text-align: center; transition: transform 0.2s; }
    .app-card:hover { transform: scale(1.03); border-color: #00ffcc; }
    .app-card h3 { color: #00ffcc; margin-bottom: 8px; }
    .app-card p { color: #aaa; }
    .app-card a { display: inline-block; margin-top: 12px; padding: 8px 14px; background: #00ffcc; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .app-card a:hover { background-color: #00e6b3; }
  </style>
</head>
<body>
  <h1>📡 MasterLiveViewing Dashboard</h1>
  <div class="app-list" id="app-list"></div>
  <script>
    const apps = ${JSON.stringify(apps, null, 2)};
    const container = document.getElementById('app-list');
    apps.forEach(app => {
      const div = document.createElement('div');
      div.className = 'app-card';
      div.innerHTML = \`
        <h3>\${app.name}</h3>
        <p>\${app.category}</p>
        <a href="\${app.url}" target="_blank">Launch</a>
      \`;
      container.appendChild(div);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(outputHTML, html);
console.log("✅ live-viewer.html created and updated.");
