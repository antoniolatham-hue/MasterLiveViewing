const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const repos = [
  {
    name: "SkyLink360",
    url: "https://github.com/YOUR_USERNAME/SkyLink360.git"
  },
  {
    name: "Vault360",
    url: "https://github.com/YOUR_USERNAME/Vault360.git"
  },
];

const baseDir = path.join(__dirname, "repos");

function checkAndFix(repo) {
  const repoPath = path.join(baseDir, repo.name);
  const exists = fs.existsSync(repoPath);

  if (!exists) {
    console.log(`📥 Cloning ${repo.name}...`);
    exec(`git clone ${repo.url} ${repoPath}`, (err) => {
      if (err) return console.error(`❌ Clone failed:\n${err}`);
      runChecks(repoPath);
    });
  } else {
    console.log(`🔄 Updating ${repo.name}...`);
    exec(`cd ${repoPath} && git pull`, (err) => {
      if (err) return console.error(`❌ Pull failed:\n${err}`);
      runChecks(repoPath);
    });
  }
}

function runChecks(dir) {
  console.log(`🔍 Checking ${dir}...`);

  exec(`cd ${dir} && npm install`, (err, stdout, stderr) => {
    if (err) return console.error(`❌ npm install error:\n${stderr}`);
    console.log(`✅ Dependencies installed`);

    exec(`cd ${dir} && npx eslint . --fix`, (err, stdout, stderr) => {
      if (err) return console.error(`⚠️ ESLint issues:\n${stderr}`);
      console.log(`✅ Code cleaned and auto-fixed`);
    });
  });
}

console.log(`🚀 Running Live Error Checker...`);
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
repos.forEach(checkAndFix);
