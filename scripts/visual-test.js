const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const baseUrl = process.env.VISUAL_TEST_URL || "http://127.0.0.1:8080";
const outputDirectory = path.resolve(__dirname, "../visual-artifacts");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

async function runVisualTests() {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.evaluate(() => window.scrollTo(0, 0));

      const checks = await page.evaluate(() => {
        const hero = document.querySelector(".hero");
        const skills = document.querySelector("#skills");
        const documentElement = document.documentElement;
        const heroBottom = hero.getBoundingClientRect().bottom;
        const skillsTop = skills.getBoundingClientRect().top;

        return {
          boundaryAligned: Math.abs(heroBottom - skillsTop) < 1,
          hasHorizontalOverflow:
            documentElement.scrollWidth > documentElement.clientWidth,
        };
      });

      if (!checks.boundaryAligned) {
        throw new Error(
          `${viewport.name}: hero and skills sections do not meet cleanly`,
        );
      }

      if (checks.hasHorizontalOverflow) {
        throw new Error(`${viewport.name}: page has horizontal overflow`);
      }

      await page.screenshot({
        path: path.join(outputDirectory, `${viewport.name}.png`),
        fullPage: true,
      });
      console.log(
        `PASS ${viewport.name}: boundary aligned, no horizontal overflow`,
      );
    }
  } finally {
    await browser.close();
  }
}

runVisualTests().catch((error) => {
  console.error(`Visual tests failed: ${error.message}`);
  process.exitCode = 1;
});
