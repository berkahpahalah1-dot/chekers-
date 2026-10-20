import { useState } from "react";

const MAX_EMAILS = 100;

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailCount = input
    .split(/[\n,]+/)
    .map((e) => e.trim())
    .filter(Boolean).length;

  async function handleVerify() {
    setError("");
    setResults([]);

    const emails = input
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter(Boolean);

    if (emails.length === 0) {
      setError("Masukkan minimal 1 email.");
      return;
    }
    if (emails.length > MAX_EMAILS) {
      setError(`Maksimal ${MAX_EMAILS} email sekaligus. Kamu memasukkan ${emails.length}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan.");
      } else {
        setResults(data.results);
      }
    } catch (err) {
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.title}>Email Verifier</h1>
        <p style={styles.subtitle}>
          Masukkan 1-{MAX_EMAILS} email (satu per baris atau dipisah koma).
        </p>

        <textarea
          style={styles.textarea}
          placeholder={"contoh1@gmail.com\ncontoh2@gmail.com"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
        />

        <div style={styles.row}>
          <span style={styles.counter}>
            {emailCount} / {MAX_EMAILS} email
          </span>
          <button
            style={styles.button}
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Memverifikasi..." : "Verify"}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {results.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Deliverability</th>
                <th style={styles.th}>Disposable</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.email}>
                  <td style={styles.td}>{r.email}</td>
                  <td
                    style={{
                      ...styles.td,
                      color: r.valid ? "#16a34a" : "#dc2626",
                      fontWeight: 600,
                    }}
                  >
                    {r.valid ? "Valid" : "Invalid"}
                  </td>
                  <td style={styles.td}>{r.deliverability ?? "-"}</td>
                  <td style={styles.td}>
                    {r.isDisposable === null ? "-" : r.isDisposable ? "Ya" : "Tidak"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "2rem 1rem",
    fontFamily: "system-ui, sans-serif",
  },
  container: {
    maxWidth: 720,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 12,
    padding: "2rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  title: { fontSize: "1.75rem", marginBottom: "0.25rem" },
  subtitle: { color: "#64748b", marginBottom: "1rem" },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    fontSize: "0.95rem",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.75rem",
  },
  counter: { color: "#64748b", fontSize: "0.875rem" },
  button: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "0.6rem 1.25rem",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  error: { color: "#dc2626", marginTop: "0.75rem" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1.5rem",
    fontSize: "0.9rem",
  },
  th: {
    textAlign: "left",
    borderBottom: "2px solid #e2e8f0",
    padding: "0.5rem",
  },
  td: {
    borderBottom: "1px solid #e2e8f0",
    padding: "0.5rem",
  },
};
