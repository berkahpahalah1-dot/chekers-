
// pages/api/verify.js
// Menerima daftar email (maks 100), memverifikasi satu-satu ke Abstract API,
// lalu mengembalikan hasilnya sebagai array JSON.

const ABSTRACT_URL = "https://emailvalidation.abstractapi.com/v1/";
const MAX_EMAILS = 100;
const CONCURRENCY = 5; // jumlah request paralel, dijaga kecil agar tidak kena rate limit

async function verifyOne(email, apiKey) {
  const url = `${ABSTRACT_URL}?api_key=${apiKey}&email=${encodeURIComponent(email)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return {
        email,
        valid: false,
        reason: `API error (status ${res.status})`,
      };
    }

    const data = await res.json();

    const isValid =
      data?.is_valid_format?.value === true &&
      data?.is_mx_found?.value === true &&
      data?.deliverability !== "UNDELIVERABLE";

    return {
      email,
      valid: isValid,
      deliverability: data?.deliverability ?? "UNKNOWN",
      isFormatValid: data?.is_valid_format?.value ?? null,
      isMxFound: data?.is_mx_found?.value ?? null,
      isSmtpValid: data?.is_smtp_valid?.value ?? null,
      isDisposable: data?.is_disposable_email?.value ?? null,
      isFreeEmail: data?.is_free_email?.value ?? null,
      qualityScore: data?.quality_score ?? null,
    };
  } catch (err) {
    return {
      email,
      valid: false,
      reason: "Gagal menghubungi API verifikasi",
    };
  }
}

// Menjalankan verifikasi dengan batas concurrency, supaya 100 email
// tidak ditembak sekaligus ke API pihak ketiga.
async function verifyBatch(emails, apiKey) {
  const results = [];
  for (let i = 0; i < emails.length; i += CONCURRENCY) {
    const chunk = emails.slice(i, i + CONCURRENCY);
    const chunkResults = await Promise.all(
      chunk.map((email) => verifyOne(email, apiKey))
    );
    results.push(...chunkResults);
  }
  return results;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ABSTRACT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "ABSTRACT_API_KEY belum diatur di environment variable server.",
    });
  }

  let { emails } = req.body ?? {};

  if (!Array.isArray(emails)) {
    return res.status(400).json({ error: "Field 'emails' harus berupa array." });
  }

  // Bersihkan: trim, buang baris kosong, buang duplikat
  emails = [...new Set(emails.map((e) => String(e).trim()).filter(Boolean))];

  if (emails.length === 0) {
    return res.status(400).json({ error: "Tidak ada email yang dikirim." });
  }

  if (emails.length > MAX_EMAILS) {
    return res.status(400).json({
      error: `Maksimal ${MAX_EMAILS} email per permintaan. Kamu mengirim ${emails.length}.`,
    });
  }

  const results = await verifyBatch(emails, apiKey);

  return res.status(200).json({ results });
      }
