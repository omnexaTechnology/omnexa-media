import { defineConfig, devices } from "@playwright/test";

/* Runs against the production server (next start), not the dev server. */
const PORT = 3200;
export default defineConfig({
  testDir: "tests",
  timeout: 90_000,
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  webServer: { command: `npm start -- -p ${PORT}`, port: PORT, reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
