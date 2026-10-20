const input = document.querySelector("#emailInput");
const inputCount = document.querySelector("#inputCount");
const summary = document.querySelector("#summary");
const results = document.querySelector("#results");
const feedback = document.querySelector("#feedback");
const MAX_EMAILS = 50;
let rows = [];

function parseEmails(value) {
  return value.split(/[\s,;]+/).map(item => item.trim()).filter(Boolean);
}
function isGmailFormat(email) {
  const parts = email.split("@");
  if (parts.length !== 2 || parts[1].toLowerCase() !== "gmail.com" || email.length > 254) return false;
  const local = parts[0];
  return local.length > 0 && local.length <= 64 &&
    !local.startsWith(".") && !local.endsWith(".") && !local.includes("..") &&
    /^[a-zA-Z0-9.]+$/.test(local);
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));
}
function updateCount() {
  const count = parseEmails(input.value).length;
  inputCount.textContent = `${Math.min(count, MAX_EMAILS)}/${MAX_EMAILS}`;
  inputCount.classList.toggle("limit", count > MAX_EMAILS);
}
input.addEventListener("input", updateCount);

async function checkMx() {
  try {
    const response = await fetch("https://cloudflare-dns.com/dns-query?name=gmail.com&type=MX", {
      headers: { accept: "application/dns-json" }
    });
    if (!response.ok) throw new Error("DNS lookup failed");
    const data = await response.json();
    const hasMx = data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
    return { status: hasMx ? "Valid" : "Unknown", detail: hasMx ? "MX record domain ditemukan." : "MX tidak dapat dipastikan." };
  } catch {
    return { status: "Unknown", detail: "Pemeriksaan DNS tidak tersedia pada jaringan ini." };
  }
}
function cssStatus(status) {
  if (status === "Valid") return "good";
  if (status === "Invalid") return "badtext";
  return "unknown";
}
function renderCard(row) {
  const format = row.format ? "Valid" : "Invalid";
  const professional = row.format ? "Domain publik" : "Tidak diperiksa";
  return `<article class="result">
    <div class="headline">
      <div class="email">${escapeHtml(row.email)}</div>
      <span class="overall ${row.format ? "ok" : "bad"}">${row.format ? "Format valid" : "Format invalid"}</span>
    </div>
    <div class="checks">
      <div class="check"><span>Format</span><b class="${cssStatus(format)}">${format}</b></div>
      <div class="check"><span>Professional</span><b class="unknown">${professional}</b></div>
      <div class="check"><span>Domain status</span><b class="${cssStatus(row.domain)}">${escapeHtml(row.domain)}</b></div>
      <div class="check"><span>Mailbox</span><b class="unknown">Unknown</b></div>
    </div>
    <p class="detail">${row.format ? "Format benar tidak membuktikan akun Gmail terdaftar." : "Alamat tidak lolos pemeriksaan format dasar."} ${escapeHtml(row.domainDetail || "")}</p>
  </article>`;
}
function render() {
  const filter = document.querySelector("#filter").value;
  const visible = rows.filter(row => filter === "all" || (filter === "valid" && row.format) || (filter === "invalid" && !row.format));
  results.innerHTML = visible.map(renderCard).join("");
}
document.querySelector("#verifyBtn").addEventListener("click", async () => {
  const emails = parseEmails(input.value);
  if (!emails.length) {
    feedback.textContent = "Masukkan daftar email terlebih dahulu.";
    summary.classList.remove("hidden");
    return;
  }
  if (emails.length > MAX_EMAILS) {
    feedback.textContent = `Maksimal ${MAX_EMAILS} email sekali pemeriksaan. Saat ini ada ${emails.length}.`;
    summary.classList.remove("hidden");
    return;
  }
  summary.classList.remove("hidden");
  feedback.textContent = "Memeriksa format dan domain…";
  const seen = new Set();
  rows = emails.map(email => {
    const key = email.toLowerCase();
    const format = isGmailFormat(email);
    const duplicate = seen.has(key);
    seen.add(key);
    return { email, format, duplicate, domain: "Memeriksa…", domainDetail: "" };
  });
  document.querySelector("#total").textContent = `${emails.length}/${MAX_EMAILS} email`;
  document.querySelector("#formatCount").textContent = rows.filter(row => row.format).length;
  document.querySelector("#domainCount").textContent = "…";
  document.querySelector("#unknownCount").textContent = rows.length;
  render();

  const mx = await checkMx();
  rows = rows.map(row => ({
    ...row,
    domain: row.format ? mx.status : "Unknown",
    domainDetail: row.format ? mx.detail : "Format tidak valid."
  }));
  document.querySelector("#domainCount").textContent = rows.filter(row => row.domain === "Valid").length;
  document.querySelector("#unknownCount").textContent = rows.length;
  render();
  feedback.textContent = "Selesai. Mailbox = Unknown karena status akun Gmail tidak dapat dipastikan lewat API publik.";
});
document.querySelector("#clearBtn").addEventListener("click", () => {
  input.value = "";
  updateCount();
  summary.classList.add("hidden");
  results.innerHTML = "";
  rows = [];
  feedback.textContent = "";
});
document.querySelector("#filter").addEventListener("change", render);
async function copyText(text) {
  if (!text) { feedback.textContent = "Tidak ada hasil untuk disalin."; return; }
  try {
    await navigator.clipboard.writeText(text);
    feedback.textContent = "Berhasil disalin.";
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    document.body.appendChild(helper);
    helper.select();
    const ok = document.execCommand("copy");
    helper.remove();
    feedback.textContent = ok ? "Berhasil disalin." : "Gagal menyalin. Silakan salin manual.";
  }
}
document.querySelector("#copyValidBtn").addEventListener("click", () => {
  copyText([...new Set(rows.filter(row => row.format).map(row => row.email))].join("\n"));
});
document.querySelector("#copyAllBtn").addEventListener("click", () => {
  copyText(rows.map(row => `${row.email} | Format: ${row.format ? "Valid" : "Invalid"} | Domain: ${row.domain} | Mailbox: Unknown`).join("\n"));
});
