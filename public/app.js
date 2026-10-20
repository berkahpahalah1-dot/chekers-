const input = document.getElementById("emails");
const checkBtn = document.getElementById("checkBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsSection = document.getElementById("resultsSection");
const resultsBody = document.getElementById("resultsBody");
const feedback = document.getElementById("feedback");
let lastRows = [];

function splitEmails(raw) {
  return raw.split(/[\s,;]+/).map(v => v.trim()).filter(Boolean);
}

function isGmailFormat(email) {
  if (email.length > 254 || /\s/.test(email)) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length > 64 || domain.toLowerCase() !== "gmail.com") return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  return /^[a-zA-Z0-9.]+$/.test(local);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
}

function runCheck() {
  const emails = splitEmails(input.value);
  if (!emails.length) {
    input.focus();
    feedback.textContent = "Masukkan setidaknya satu alamat email terlebih dahulu.";
    resultsSection.classList.remove("hidden");
    resultsBody.innerHTML = "";
    return;
  }

  const seen = new Set();
  lastRows = emails.map(email => {
    const normalized = email.toLowerCase();
    const valid = isGmailFormat(email);
    const duplicate = seen.has(normalized);
    seen.add(normalized);
    let status, css;
    if (!valid) {
      status = "Format tidak valid";
      css = "status-invalid";
    } else if (duplicate) {
      status = "Duplikat";
      css = "status-duplicate";
    } else {
      status = "Format valid · akun tidak diketahui";
      css = "status-valid";
    }
    return { email, valid, duplicate, status, css };
  });

  const validCount = lastRows.filter(r => r.valid && !r.duplicate).length;
  const invalidCount = lastRows.filter(r => !r.valid).length;
  const duplicateCount = lastRows.filter(r => r.valid && r.duplicate).length;

  document.getElementById("totalBadge").textContent = `${emails.length} email`;
  document.getElementById("validCount").textContent = validCount;
  document.getElementById("invalidCount").textContent = invalidCount;
  document.getElementById("duplicateCount").textContent = duplicateCount;
  resultsBody.innerHTML = lastRows.map(row =>
    `<tr><td>${escapeHtml(row.email)}</td><td><span class="status ${row.css}">${escapeHtml(row.status)}</span></td></tr>`
  ).join("");
  resultsSection.classList.remove("hidden");
  feedback.textContent = "Selesai. Status akun terdaftar tidak dapat dipastikan dari pemeriksaan ini.";
}

async function copyText(text) {
  if (!text) {
    feedback.textContent = "Tidak ada email untuk disalin.";
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    feedback.textContent = "Berhasil disalin.";
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    const ok = document.execCommand("copy");
    helper.remove();
    feedback.textContent = ok ? "Berhasil disalin." : "Gagal menyalin. Silakan salin secara manual.";
  }
}

checkBtn.addEventListener("click", runCheck);
clearBtn.addEventListener("click", () => {
  input.value = "";
  resultsSection.classList.add("hidden");
  resultsBody.innerHTML = "";
  feedback.textContent = "";
  lastRows = [];
  input.focus();
});
document.getElementById("copyValidBtn").addEventListener("click", () => {
  const emails = [...new Set(lastRows.filter(r => r.valid).map(r => r.email.toLowerCase()))];
  return copyText(emails.join("\n"));
});
document.getElementById("copyResultsBtn").addEventListener("click", () => {
  return copyText(lastRows.map(r => `${r.email} = ${r.status}`).join("\n"));
});
    
