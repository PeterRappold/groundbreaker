#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkgPath = path.join(root, "package.json");
const templatePath = path.join(root, "scripts", "install-linux.sh");
const outPath = path.join(root, "dist-desktop", "install-groundbreaker.sh");

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--base-url") {
      out.baseUrl = argv[++i];
    } else if (arg === "--icon-url") {
      out.iconUrl = argv[++i];
    } else if (arg === "--version") {
      out.version = argv[++i];
    }
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const version = args.version || pkg.version;
  const baseUrl = args.baseUrl || process.env.RELEASE_BASE_URL;
  const iconUrl = args.iconUrl || process.env.RELEASE_ICON_URL || "";

  if (!baseUrl) {
    console.error("Error: missing release base URL.");
    console.error("Use RELEASE_BASE_URL=<url> npm run bundle:linux-installer:web");
    console.error("or: node scripts/generate-linux-installer.js --base-url <url>");
    process.exit(1);
  }

  let script = fs.readFileSync(templatePath, "utf8");
  script = script.replace(/__VERSION__/g, version);
  script = script.replace(/__BASE_URL__/g, baseUrl.replace(/\/$/, ""));

  if (iconUrl) {
    const escaped = iconUrl.replace(/"/g, "\\\"");
    script = script.replace('ICON_URL="${GROUNDBREAKER_ICON_URL:-}"', 'ICON_URL="${GROUNDBREAKER_ICON_URL:-' + escaped + '}"');
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, script, { mode: 0o755 });
  fs.chmodSync(outPath, 0o755);

  console.log(`Generated ${outPath}`);
  console.log(`- version: ${version}`);
  console.log(`- base url: ${baseUrl}`);
  if (iconUrl) console.log(`- icon url: ${iconUrl}`);
}

main();
