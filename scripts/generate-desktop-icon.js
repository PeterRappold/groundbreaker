const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function main() {
  const root = path.join(__dirname, "..");
  const source = path.join(root, "build", "icon.svg");
  const output = path.join(root, "build", "icon.png");

  await sharp(source)
    .resize(1024, 1024, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(output);

  const stats = fs.statSync(output);
  console.log(`Generated desktop icon: ${output} (${stats.size} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});