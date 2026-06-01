const app = document.querySelector("#app");
const copyButton = document.querySelector("#copy-report");
let lastReport = null;

const percent = (value) => `${Math.round(value)}%`;

function card(title, value, meta = "") {
  return `<article class="card"><span>${title}</span><strong>${value}</strong>${meta ? `<small>${meta}</small>` : ""}</article>`;
}

function render(report) {
  lastReport = report;
  const tools = report.tools.map((tool) => `<li class="${tool.ok ? "ok" : "bad"}"><b>${tool.name}</b><span>${tool.version}</span></li>`).join("");
  const ports = report.ports.map((port) => `<li><b>${port.port}</b><span>${port.state}</span></li>`).join("");
  const processes = report.processes.map((item) => `<li><b>${item.name}</b><span>${item.memoryMb} MB</span></li>`).join("");

  app.innerHTML = `
    ${card("Memory used", percent(report.system.memory.usedPercent), `${report.system.memory.freeGb} GB free of ${report.system.memory.totalGb} GB`)}
    ${card("CPU cores", report.system.cpuCores, report.system.cpuModel)}
    ${card("Uptime", `${report.system.uptimeHours}h`, report.system.hostname)}
    ${card("Platform", report.system.platform, new Date(report.generatedAt).toLocaleString())}
    <article class="panel"><h2>Tools</h2><ul>${tools}</ul></article>
    <article class="panel"><h2>Common ports</h2><ul>${ports}</ul></article>
    <article class="panel wide"><h2>Top processes</h2><ul>${processes}</ul></article>
  `;
}

async function refresh() {
  const response = await fetch("/api/report");
  render(await response.json());
}

copyButton.addEventListener("click", async () => {
  if (!lastReport) return;
  await navigator.clipboard.writeText(JSON.stringify(lastReport, null, 2));
  copyButton.textContent = "Copied";
  setTimeout(() => { copyButton.textContent = "Copy report"; }, 1200);
});

refresh().catch((error) => {
  app.innerHTML = `<article class="panel wide"><h2>Unable to load report</h2><p>${error.message}</p></article>`;
});
setInterval(refresh, 15000);
