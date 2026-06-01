import { describe, expect, it } from "vitest";
import { createReport } from "../src/server/report.js";

describe("dev-pulse report", () => {
  it("returns system, tool, port, and process data", async () => {
    const report = await createReport();
    expect(report.system.cpuCores).toBeGreaterThan(0);
    expect(report.system.memory.totalGb).toBeGreaterThan(0);
    expect(report.tools.some((tool) => tool.name === "Node")).toBe(true);
    expect(report.ports.length).toBeGreaterThan(0);
    expect(report.processes.length).toBeGreaterThan(0);
  });
});
