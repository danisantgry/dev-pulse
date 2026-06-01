import { execFile } from "node:child_process";
import os from "node:os";
import { promisify } from "node:util";

const exec = promisify(execFile);

export type DevPulseReport = {
  generatedAt: string;
  system: {
    platform: string;
    hostname: string;
    uptimeHours: number;
    cpuModel: string;
    cpuCores: number;
    loadAverage: number[];
    memory: {
      totalGb: number;
      freeGb: number;
      usedPercent: number;
    };
  };
  tools: Array<{ name: string; version: string; ok: boolean }>;
  ports: Array<{ port: number; state: "open" | "closed" }>;
  processes: Array<{ pid: number; name: string; memoryMb: number }>;
};

async function version(command: string, args = ["--version"]): Promise<{ version: string; ok: boolean }> {
  try {
    const { stdout, stderr } = await exec(command, args, { timeout: 2500 });
    return { version: (stdout || stderr).trim().split(/\r?\n/)[0] ?? "ok", ok: true };
  } catch {
    return { version: "not found", ok: false };
  }
}

async function checkPort(port: number): Promise<{ port: number; state: "open" | "closed" }> {
  const net = await import("node:net");
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port, timeout: 350 });
    socket.once("connect", () => {
      socket.destroy();
      resolve({ port, state: "open" });
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve({ port, state: "closed" });
    });
    socket.once("error", () => resolve({ port, state: "closed" }));
  });
}

async function listProcesses(): Promise<Array<{ pid: number; name: string; memoryMb: number }>> {
  if (process.platform !== "win32") {
    return [{ pid: process.pid, name: "node", memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024) }];
  }

  try {
    const { stdout } = await exec("powershell.exe", [
      "-NoProfile",
      "-Command",
      "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 6 Id,ProcessName,WorkingSet64 | ConvertTo-Json"
    ], { timeout: 5000 });
    const parsed = JSON.parse(stdout) as Array<{ Id: number; ProcessName: string; WorkingSet64: number }> | { Id: number; ProcessName: string; WorkingSet64: number };
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    return rows.map((row) => ({ pid: row.Id, name: row.ProcessName, memoryMb: Math.round(row.WorkingSet64 / 1024 / 1024) }));
  } catch {
    return [{ pid: process.pid, name: "node", memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024) }];
  }
}

export async function createReport(): Promise<DevPulseReport> {
  const total = os.totalmem();
  const free = os.freemem();
  const cpus = os.cpus();

  return {
    generatedAt: new Date().toISOString(),
    system: {
      platform: `${os.type()} ${os.release()}`,
      hostname: os.hostname(),
      uptimeHours: Math.round((os.uptime() / 60 / 60) * 10) / 10,
      cpuModel: cpus[0]?.model ?? "unknown",
      cpuCores: cpus.length,
      loadAverage: os.loadavg(),
      memory: {
        totalGb: Math.round((total / 1024 / 1024 / 1024) * 10) / 10,
        freeGb: Math.round((free / 1024 / 1024 / 1024) * 10) / 10,
        usedPercent: Math.round(((total - free) / total) * 100)
      }
    },
    tools: [
      { name: "Node", ...(await version("node")) },
      { name: "npm", ...(await version("npm.cmd")) },
      { name: "Git", ...(await version("git")) },
      { name: "Docker", ...(await version("docker")) }
    ],
    ports: await Promise.all([3000, 4173, 5173, 8000, 8080].map(checkPort)),
    processes: await listProcesses()
  };
}
