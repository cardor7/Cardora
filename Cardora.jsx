import { useState, useEffect, useRef } from "react";

// ── Palette & tokens ────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0a0f;
  --surface: #111118;
  --surface2: #18181f;
  --border: rgba(139,92,246,0.18);
  --border2: rgba(255,255,255,0.07);
  --purple: #8b5cf6;
  --purple2: #a78bfa;
  --blue: #3b82f6;
  --cyan: #06b6d4;
  --pink: #ec4899;
  --green: #10b981;
  --yellow: #f59e0b;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --muted2: #475569;
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --glow: 0 0 40px rgba(139,92,246,0.25);
  --glow-sm: 0 0 16px rgba(139,92,246,0.2);
  --radius: 16px;
  --radius-sm: 10px;
}

body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; overflow-x: hidden; }

/* scrollbar */
::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--surface); } ::-webkit-scrollbar-thumb { background: var(--purple); border-radius: 99px; }

/* animations */
@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
@keyframes gradShift { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
@keyframes scanline { 0% { transform:translateY(-100%); } 100% { transform:translateY(100vh); } }
@keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
@keyframes glitch { 0%,100% { clip-path:inset(0 0 95% 0); } 25% { clip-path:inset(30% 0 50% 0); } 75% { clip-path:inset(70% 0 5% 0); } }
@keyframes neonPulse { 0%,100% { box-shadow:0 0 5px #8b5cf6,0 0 20px #8b5cf6,0 0 40px rgba(139,92,246,0.3); } 50% { box-shadow:0 0 10px #a78bfa,0 0 40px #a78bfa,0 0 80px rgba(167,139,250,0.4); } }
@keyframes ripple { 0% { transform:scale(0); opacity:1; } 100% { transform:scale(4); opacity:0; } }

.fade-up { animation: fadeUp 0.6s ease forwards; }
.float { animation: float 4s ease-in-out infinite; }

/* glassmorphism */
.glass {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.glass-purple {
  background: rgba(139,92,246,0.08);
  border: 1px solid var(--border);
  backdrop-filter: blur(20px);
}

/* gradient text */
.grad-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #a78bfa 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradShift 4s ease infinite;
}

/* buttons */
.btn-primary {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  letter-spacing: 0.3px;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(139,92,246,0.45); }
.btn-primary:active { transform: scale(0.97); }

.btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  padding: 12px 28px;
  border-radius: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover { background: rgba(139,92,246,0.12); border-color: var(--purple); }

.btn-sm { padding: 8px 18px; font-size: 13px; border-radius: 8px; }

/* nav */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 0 32px;
  height: 68px;
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(10,10,15,0.85);
  border-bottom: 1px solid var(--border2);
  backdrop-filter: blur(24px);
}
.nav-logo { font-family: var(--font-display); font-weight: 800; font-size: 22px; cursor: pointer; }
.nav-links { display: flex; gap: 8px; align-items: center; }
.nav-link { background: none; border: none; color: var(--muted); font-family: var(--font-body); font-size: 14px; font-weight: 500; cursor: pointer; padding: 8px 14px; border-radius: 8px; transition: all 0.2s; }
.nav-link:hover, .nav-link.active { color: var(--text); background: rgba(255,255,255,0.06); }

/* cards */
.card { background: var(--surface); border: 1px solid var(--border2); border-radius: var(--radius); padding: 24px; }
.card-hover { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; cursor: pointer; }
.card-hover:hover { transform: translateY(-4px); box-shadow: var(--glow); border-color: var(--border); }

/* gift card widget */
.gift-card {
  border-radius: 14px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  min-height: 160px;
  display: flex; flex-direction: column; justify-content: space-between;
}
.gift-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
  pointer-events: none;
}
.gift-card-shine {
  position: absolute; top: -50%; right: -20%;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
}

/* badge */
.badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.5px; }
.badge-green { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.25); }
.badge-purple { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.25); }
.badge-yellow { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); }
.badge-red { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
.badge-blue { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); }

/* input */
.input {
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border2);
  color: var(--text);
  padding: 12px 16px;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input:focus { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }
.input::placeholder { color: var(--muted2); }
select.input { appearance: none; cursor: pointer; }

/* label */
.label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; display: block; font-family: var(--font-display); }

/* stat card */
.stat-card { padding: 24px; border-radius: var(--radius); position: relative; overflow: hidden; }

/* sidebar */
.sidebar { width: 240px; min-height: 100vh; background: var(--surface); border-right: 1px solid var(--border2); padding: 24px 16px; display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
.sidebar-item { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--muted); transition: all 0.18s; border: none; background: none; width: 100%; text-align: left; font-family: var(--font-body); }
.sidebar-item:hover { color: var(--text); background: rgba(255,255,255,0.05); }
.sidebar-item.active { color: var(--purple2); background: rgba(139,92,246,0.12); }

/* progress bar */
.progress-bar { height: 6px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #8b5cf6, #06b6d4); transition: width 0.6s ease; }

/* table */
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th { padding: 12px 16px; text-align: left; font-family: var(--font-display); font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); border-bottom: 1px solid var(--border2); font-weight: 600; }
.table td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: rgba(255,255,255,0.02); }

/* modal */
.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 32px; width: 100%; max-width: 480px; position: relative; animation: fadeUp 0.3s ease; max-height: 90vh; overflow-y: auto; }

/* hero bg */
.hero-bg {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.35; }
.orb1 { width: 600px; height: 600px; background: #8b5cf6; top: -200px; left: -100px; }
.orb2 { width: 500px; height: 500px; background: #3b82f6; top: -100px; right: -100px; }
.orb3 { width: 400px; height: 400px; background: #06b6d4; bottom: -150px; left: 30%; }

/* toast */
.toast { position: fixed; bottom: 28px; right: 28px; z-index: 999; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; box-shadow: 0 8px 32px rgba(0,0,0,0.4); animation: fadeUp 0.3s ease; max-width: 320px; }

/* scrollable content area */
.content-area { flex: 1; overflow-y: auto; padding: 32px; }

/* rating stars */
.stars { color: #f59e0b; font-size: 12px; letter-spacing: 1px; }

/* chip filter */
.chip { padding: 7px 16px; border-radius: 99px; border: 1px solid var(--border2); background: transparent; color: var(--muted); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s; font-family: var(--font-body); white-space: nowrap; }
.chip:hover { border-color: var(--purple); color: var(--text); }
.chip.active { background: rgba(139,92,246,0.18); border-color: var(--purple); color: var(--purple2); }

/* responsive */
@media (max-width: 768px) {
  .nav { padding: 0 16px; }
  .nav-links .nav-link { display: none; }
  .sidebar { display: none; }
  .content-area { padding: 20px 16px; }
}

/* extra utilities */
.divider { height: 1px; background: var(--border2); margin: 20px 0; }
.text-muted { color: var(--muted); }
.text-muted2 { color: var(--muted2); }
.text-green { color: var(--green); }
.text-purple { color: var(--purple2); }
.text-yellow { color: var(--yellow); }
.text-pink { color: var(--pink); }
.flex { display: flex; } .flex-col { flex-direction: column; } .items-center { align-items: center; } .justify-between { justify-content: space-between; } .justify-center { justify-content: center; } .gap-4 { gap: 16px; } .gap-3 { gap: 12px; } .gap-2 { gap: 8px; } .gap-1 { gap: 4px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 900px) { .grid-4 { grid-template-columns: repeat(2,1fr); } .grid-3 { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 600px) { .grid-4,.grid-3,.grid-2 { grid-template-columns: 1fr; } }
.w-full { width: 100%; } .mt-1 { margin-top: 4px; } .mt-2 { margin-top: 8px; } .mt-3 { margin-top: 12px; } .mt-4 { margin-top: 16px; } .mt-6 { margin-top: 24px; } .mt-8 { margin-top: 32px; } .mb-2 { margin-bottom: 8px; } .mb-3 { margin-bottom: 12px; } .mb-4 { margin-bottom: 16px; } .mb-6 { margin-bottom: 24px; }
.fw-600 { font-weight: 600; } .fw-700 { font-weight: 700; } .fw-800 { font-weight: 800; }
.fs-12 { font-size: 12px; } .fs-13 { font-size: 13px; } .fs-14 { font-size: 14px; } .fs-28 { font-size: 28px; } .fs-32 { font-size: 32px; } .fs-40 { font-size: 40px; } .fs-56 { font-size: clamp(36px,6vw,56px); }
.font-display { font-family: var(--font-display); }
.text-center { text-align: center; }
.rounded-full { border-radius: 99px; }
.p-3 { padding: 12px; } .p-4 { padding: 16px; } .p-5 { padding: 20px; }
.relative { position: relative; } .overflow-hidden { overflow: hidden; }
`;

// ── Data ───────────────────────────────────────────────────────────────────
const BRANDS = {
  Amazon: { color: "#FF9900", bg: "linear-gradient(135deg,#FF9900,#FF6600)", icon: "🛒" },
  Flipkart: { color: "#2874F0", bg: "linear-gradient(135deg,#2874F0,#1a5cb8)", icon: "🛍️" },
  Myntra: { color: "#FF3F6C", bg: "linear-gradient(135deg,#FF3F6C,#cc2952)", icon: "👗" },
  Steam: { color: "#1b2838", bg: "linear-gradient(135deg,#4a90d9,#1b2838)", icon: "🎮" },
  "Google Play": { color: "#01875f", bg: "linear-gradient(135deg,#01875f,#34a853)", icon: "▶️" },
  Apple: { color: "#555", bg: "linear-gradient(135deg,#888,#333)", icon: "🍎" },
  Swiggy: { color: "#FC8019", bg: "linear-gradient(135deg,#FC8019,#d4601a)", icon: "🍔" },
  Zomato: { color: "#E23744", bg: "linear-gradient(135deg,#E23744,#b82a35)", icon: "🍕" },
};

const MOCK_CARDS = [
  { id: 1, brand: "Amazon", originalValue: 1000, seller: "priya_s", rating: 4.9, reviews: 128, listed: "2h ago", popular: true },
  { id: 2, brand: "Flipkart", originalValue: 500, seller: "rahul_k", rating: 4.7, reviews: 89, listed: "5h ago", popular: false },
  { id: 3, brand: "Steam", originalValue: 2000, seller: "gamer_x", rating: 5.0, reviews: 45, listed: "1d ago", popular: true },
  { id: 4, brand: "Myntra", originalValue: 750, seller: "fashionista", rating: 4.6, reviews: 67, listed: "3h ago", popular: false },
  { id: 5, brand: "Google Play", originalValue: 200, seller: "tech_guru", rating: 4.8, reviews: 203, listed: "8h ago", popular: true },
  { id: 6, brand: "Apple", originalValue: 3000, seller: "apple_lover", rating: 4.5, reviews: 34, listed: "2d ago", popular: false },
  { id: 7, brand: "Swiggy", originalValue: 300, seller: "foodie99", rating: 4.9, reviews: 156, listed: "30m ago", popular: true },
  { id: 8, brand: "Zomato", originalValue: 400, seller: "hungry_one", rating: 4.7, reviews: 91, listed: "1h ago", popular: false },
];

const MOCK_TRANSACTIONS = [
  { id: "TXN001", buyer: "rohan@mail.com", brand: "Amazon", amount: 700, commission: 70, seller: "priya_s", status: "completed", date: "24 May 2026" },
  { id: "TXN002", buyer: "meera@mail.com", brand: "Steam", amount: 1400, commission: 140, seller: "gamer_x", status: "completed", date: "23 May 2026" },
  { id: "TXN003", buyer: "arun@mail.com", brand: "Myntra", amount: 525, commission: 52.5, seller: "fashionista", status: "pending", date: "24 May 2026" },
  { id: "TXN004", buyer: "divya@mail.com", brand: "Google Play", amount: 140, commission: 14, seller: "tech_guru", status: "completed", date: "22 May 2026" },
  { id: "TXN005", buyer: "kiran@mail.com", brand: "Apple", amount: 2100, commission: 210, seller: "apple_lover", status: "flagged", date: "21 May 2026" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const discounted = (v) => Math.round(v * 0.7);
const commission = (v) => Math.round(discounted(v) * 0.1);
const sellerReceives = (v) => discounted(v) - commission(v);
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

// ── Toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className="toast">
      <span style={{ fontSize: 18 }}>✅</span>
      <span>{msg}</span>
    </div>
  );
}

// ── GiftCardWidget ──────────────────────────────────────────────────────────
function GiftCardWidget({ brand, value, code, small }) {
  const b = BRANDS[brand] || { bg: "linear-gradient(135deg,#8b5cf6,#3b82f6)", icon: "🎁" };
  return (
    <div className="gift-card" style={{ background: b.bg, width: small ? 200 : "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <div className="gift-card-shine" />
      <div className="flex justify-between items-center">
        <span style={{ fontSize: small ? 20 : 28 }}>{b.icon}</span>
        <span style={{ fontSize: small ? 10 : 12, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: 1 }}>GIFT CARD</span>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: small ? 16 : 24, color: "#fff", marginBottom: 4 }}>{brand}</div>
        <div style={{ fontSize: small ? 20 : 32, fontWeight: 800, color: "#fff", fontFamily: "var(--font-display)" }}>{fmt(value)}</div>
        {code && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4, letterSpacing: 2, fontFamily: "monospace" }}>{code}</div>}
      </div>
    </div>
  );
}

// ── StatCard ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = "#8b5cf6", trend }) {
  return (
    <div className="stat-card glass">
      <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderRadius: "50%", background: color, filter: "blur(60px)", opacity: 0.15 }} />
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text)" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{sub}</div>}
      {trend && <div style={{ fontSize: 12, color: "var(--green)", marginTop: 6, fontWeight: 600 }}>↑ {trend}</div>}
    </div>
  );
}

// ── MarketCard ──────────────────────────────────────────────────────────────
function MarketCard({ card, onBuy }) {
  const b = BRANDS[card.brand];
  const disc = discounted(card.originalValue);
  const save = card.originalValue - disc;
  const savePct = Math.round((save / card.originalValue) * 100);
  return (
    <div className="card card-hover" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {card.popular && <div className="badge badge-yellow" style={{ alignSelf: "flex-start" }}>🔥 Popular</div>}
      <div style={{ height: 8, borderRadius: 99, background: b.bg }} />
      <div className="flex items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: 10, background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{b.icon}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "var(--font-display)" }}>{card.brand}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>by {card.seller} · {card.listed}</div>
        </div>
        <div className="badge badge-green" style={{ marginLeft: "auto" }}>Save {savePct}%</div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", textDecoration: "line-through" }}>{fmt(card.originalValue)}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "var(--purple2)", fontFamily: "var(--font-display)" }}>{fmt(disc)}</div>
        </div>
        <div className="text-center">
          <div className="stars">{stars(card.rating)}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{card.rating} ({card.reviews})</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn-primary" style={{ flex: 1 }} onClick={() => onBuy(card)}>Buy Now</button>
      </div>
    </div>
  );
}

// ── PaymentModal ────────────────────────────────────────────────────────────
function PaymentModal({ card, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const disc = discounted(card.originalValue);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 2200);
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>✕</button>

        {step === 1 && <>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Complete Purchase</h2>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>Secure payment via Razorpay</p>

          <GiftCardWidget brand={card.brand} value={card.originalValue} />

          <div className="divider" />

          <div className="flex justify-between" style={{ marginBottom: 8, fontSize: 14 }}>
            <span className="text-muted">Original Value</span><span style={{ textDecoration: "line-through", color: "var(--muted)" }}>{fmt(card.originalValue)}</span>
          </div>
          <div className="flex justify-between" style={{ marginBottom: 8, fontSize: 14 }}>
            <span className="text-muted">Discount (30%)</span><span className="text-green">-{fmt(card.originalValue - disc)}</span>
          </div>
          <div className="flex justify-between" style={{ marginBottom: 20, fontSize: 18, fontWeight: 800, fontFamily: "var(--font-display)" }}>
            <span>You Pay</span><span className="text-purple">{fmt(disc)}</span>
          </div>

          <div className="glass-purple" style={{ padding: 12, borderRadius: 10, marginBottom: 20, fontSize: 13, color: "var(--muted)" }}>
            🔒 Your gift code will be revealed immediately after payment confirmation
          </div>

          <button className="btn-primary w-full" style={{ fontSize: 16, padding: 14 }} onClick={handlePay} disabled={loading}>
            {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              Processing...
            </span> : `Pay ${fmt(disc)} via Razorpay`}
          </button>

          <div className="flex items-center justify-center gap-2 mt-3">
            <span style={{ fontSize: 11, color: "var(--muted)" }}>🔐 256-bit SSL · Razorpay Protected · PCI DSS Compliant</span>
          </div>
        </>}

        {step === 2 && <>
          <div className="text-center" style={{ padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16, animation: "float 2s ease-in-out infinite" }}>🎉</div>
            <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Payment Successful!</h2>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>Your gift card code has been unlocked</p>

            <div className="card" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Your Gift Code</div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, fontFamily: "monospace", color: "var(--green)" }}>
                {card.brand.toUpperCase().slice(0,3)}-{Math.random().toString(36).slice(2,6).toUpperCase()}-{Math.random().toString(36).slice(2,6).toUpperCase()}
              </div>
            </div>

            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Confirmation sent to your email · {card.brand} card worth {fmt(card.originalValue)}</div>

            <button className="btn-primary w-full" onClick={() => { onSuccess(); onClose(); }}>Done</button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ── LANDING PAGE ────────────────────────────────────────────────────────────
function LandingPage({ setPage }) {
  const [count, setCount] = useState({ cards: 0, saved: 0, users: 0 });
  useEffect(() => {
    const targets = { cards: 18420, saved: 4200000, users: 52300 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const t = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        cards: Math.round(targets.cards * ease),
        saved: Math.round(targets.saved * ease),
        users: Math.round(targets.users * ease),
      });
      if (step >= steps) clearInterval(t);
    }, interval);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 100, paddingBottom: 80, overflow: "hidden" }}>
        <div className="hero-bg">
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
          {/* grid overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <div className="badge badge-purple mb-4" style={{ margin: "0 auto 20px" }}>
            ⚡ India's #1 Gift Card Marketplace
          </div>

          <h1 className="fs-56 font-display fw-800" style={{ lineHeight: 1.1, marginBottom: 20 }}>
            Turn Unused Gift Cards<br />
            into <span className="grad-text">Instant Cash</span>
          </h1>

          <p style={{ fontSize: 18, color: "var(--muted)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Buy discounted gift cards at up to 30% off, or sell your unused ones instantly. 
            Secure, instant, and hassle-free.
          </p>

          <div className="flex gap-4 justify-center" style={{ flexWrap: "wrap", marginBottom: 64 }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setPage("sell")}>
              💸 Sell Gift Cards
            </button>
            <button className="btn-ghost" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setPage("market")}>
              🛍️ Buy Discounted Cards
            </button>
          </div>

          {/* Floating cards preview */}
          <div className="flex gap-4 justify-center" style={{ flexWrap: "wrap", perspective: 800 }}>
            {["Amazon", "Steam", "Myntra"].map((brand, i) => (
              <div key={brand} className="float" style={{ animationDelay: `${i * 0.4}s`, flex: "0 0 auto" }}>
                <GiftCardWidget brand={brand} value={[1000, 2000, 750][i]} small />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "80px 32px", maxWidth: 900, margin: "0 auto" }}>
        <div className="grid-3">
          {[
            { icon: "🃏", label: "Cards Sold", value: count.cards.toLocaleString("en-IN"), sub: "and counting", color: "#8b5cf6" },
            { icon: "💰", label: "Money Saved", value: "₹" + (count.saved / 100000).toFixed(1) + "L", sub: "by buyers like you", color: "#06b6d4" },
            { icon: "👥", label: "Active Users", value: count.users.toLocaleString("en-IN"), sub: "trust Cardora", color: "#10b981" },
          ].map(s => <StatCard key={s.label} {...s} trend="18% this month" />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "40px 32px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 className="font-display fs-32 fw-800 text-center mb-6">How It Works</h2>
        <p className="text-muted text-center mb-6" style={{ maxWidth: 440, margin: "0 auto 40px" }}>Simple, secure, and transparent — start in seconds</p>

        <div className="grid-2">
          <div className="card" style={{ borderColor: "rgba(139,92,246,0.3)" }}>
            <div className="badge badge-purple mb-3">For Sellers</div>
            {[
              { icon: "📤", step: "01", title: "List Your Card", desc: "Upload brand, value, code, and expiry. Your code stays encrypted." },
              { icon: "⚡", step: "02", title: "Instant Pricing", desc: "We auto-price at 70% of face value so buyers are attracted." },
              { icon: "✅", step: "03", title: "Get Paid", desc: "Once sold, 90% of the sale amount lands in your Cardora wallet." },
            ].map(s => (
              <div key={s.step} className="flex gap-3" style={{ marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--purple2)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 2 }}>STEP {s.step}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
            <button className="btn-primary w-full" onClick={() => setPage("sell")}>Start Selling</button>
          </div>

          <div className="card" style={{ borderColor: "rgba(6,182,212,0.3)" }}>
            <div className="badge badge-blue mb-3">For Buyers</div>
            {[
              { icon: "🔍", step: "01", title: "Browse Listings", desc: "Filter by brand, value, rating. Find the best deal instantly." },
              { icon: "💳", step: "02", title: "Pay via Razorpay", desc: "Secure checkout with UPI, cards, netbanking, and wallets." },
              { icon: "🎁", step: "03", title: "Get Your Code", desc: "Gift code revealed immediately after payment confirmation." },
            ].map(s => (
              <div key={s.step} className="flex gap-3" style={{ marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--cyan)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 2 }}>STEP {s.step}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
            <button className="btn-primary w-full" onClick={() => setPage("market")}>Browse Cards</button>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section style={{ padding: "40px 32px 80px", maxWidth: 900, margin: "0 auto" }}>
        <div className="flex gap-4 justify-center" style={{ flexWrap: "wrap" }}>
          {[
            { icon: "🔐", title: "AES-256 Encryption", desc: "All gift codes encrypted at rest" },
            { icon: "⚡", title: "Instant Delivery", desc: "Codes revealed in under 3 seconds" },
            { icon: "🛡️", title: "Razorpay Protected", desc: "Bank-grade payment security" },
            { icon: "🔍", title: "Fraud Detection", desc: "AI-powered transaction monitoring" },
          ].map(b => (
            <div key={b.title} className="glass" style={{ padding: "20px 24px", borderRadius: 14, textAlign: "center", minWidth: 180, flex: "1 1 180px", maxWidth: 220 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "var(--font-display)", marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ padding: "60px 32px", textAlign: "center", borderTop: "1px solid var(--border2)" }}>
        <h2 className="font-display fs-32 fw-800 mb-3">Ready to get started?</h2>
        <p className="text-muted mb-6">Join 52,000+ users who trust Cardora</p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }} onClick={() => setPage("signup")}>Create Free Account</button>
          <button className="btn-ghost" style={{ fontSize: 15, padding: "14px 32px" }} onClick={() => setPage("market")}>Explore Marketplace</button>
        </div>
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border2)", fontSize: 13, color: "var(--muted2)" }}>
          © 2026 Cardora · Admin UPI: 6360414305@fam · All transactions secured by Razorpay
        </div>
      </section>
    </div>
  );
}

// ── MARKETPLACE ─────────────────────────────────────────────────────────────
function Marketplace({ setPage, showToast }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [buyCard, setBuyCard] = useState(null);

  const filters = ["All", ...Object.keys(BRANDS)];
  const filtered = MOCK_CARDS.filter(c =>
    (filter === "All" || c.brand === filter) &&
    c.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "100px 32px 60px", maxWidth: 1100, margin: "0 auto" }}>
      <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="font-display fw-800" style={{ fontSize: 28 }}>Marketplace</h1>
          <p className="text-muted mt-1" style={{ fontSize: 14 }}>{filtered.length} cards available · Up to 30% off</p>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setPage("sell")}>+ List a Card</button>
      </div>

      {/* Search */}
      <input className="input mb-4" placeholder="🔍  Search by brand..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />

      {/* Filter chips */}
      <div className="flex gap-2 mb-6" style={{ overflowX: "auto", paddingBottom: 4, flexWrap: "nowrap" }}>
        {filters.map(f => (
          <button key={f} className={`chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{BRANDS[f] ? BRANDS[f].icon + " " : ""}{f}</button>
        ))}
      </div>

      {/* Featured banner */}
      <div className="glass-purple" style={{ padding: "20px 24px", borderRadius: 14, marginBottom: 28, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 32 }}>⚡</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "var(--font-display)" }}>Flash Deal — Steam Cards at 30% off</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Limited time · 14 cards remaining</div>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setFilter("Steam")}>View Deal</button>
      </div>

      <div className="grid-4">
        {filtered.map(card => (
          <MarketCard key={card.id} card={card} onBuy={setBuyCard} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center" style={{ padding: "60px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div className="font-display fw-700" style={{ fontSize: 18, marginBottom: 8 }}>No cards found</div>
          <div className="text-muted">Try a different brand or search term</div>
        </div>
      )}

      {buyCard && <PaymentModal card={buyCard} onClose={() => setBuyCard(null)} onSuccess={() => showToast("Purchase successful! Check your email.")} />}
    </div>
  );
}

// ── SELL PAGE ───────────────────────────────────────────────────────────────
function SellPage({ showToast }) {
  const [form, setForm] = useState({ brand: "Amazon", code: "", value: "", expiry: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const val = Number(form.value);
  const disc = val ? discounted(val) : 0;
  const comm = val ? commission(val) : 0;
  const earn = val ? sellerReceives(val) : 0;

  const handleSubmit = () => {
    if (!form.code || !form.value || !form.expiry) { showToast("Please fill all fields"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); showToast("Listing submitted successfully!"); }, 1800);
  };

  if (submitted) return (
    <div style={{ padding: "100px 32px 60px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>🎉</div>
      <h2 className="font-display fw-800" style={{ fontSize: 28, marginBottom: 8 }}>Listing Live!</h2>
      <p className="text-muted mb-6">Your {form.brand} gift card worth {fmt(val)} is now listed for {fmt(disc)}.<br />You'll earn {fmt(earn)} when it sells.</p>
      <div className="glass" style={{ padding: 20, borderRadius: 14, marginBottom: 24, textAlign: "left" }}>
        <div className="flex justify-between mb-2"><span className="text-muted fs-13">Listed Price</span><span className="fw-600">{fmt(disc)}</span></div>
        <div className="flex justify-between mb-2"><span className="text-muted fs-13">Cardora Commission (10%)</span><span style={{ color: "var(--yellow)" }}>-{fmt(comm)}</span></div>
        <div className="divider" />
        <div className="flex justify-between"><span className="fw-700">You Receive</span><span className="fw-800 text-green" style={{ fontSize: 18, fontFamily: "var(--font-display)" }}>{fmt(earn)}</span></div>
      </div>
      <button className="btn-primary w-full" onClick={() => setSubmitted(false)}>List Another Card</button>
    </div>
  );

  return (
    <div style={{ padding: "100px 32px 60px", maxWidth: 700, margin: "0 auto" }}>
      <h1 className="font-display fw-800 mb-1" style={{ fontSize: 28 }}>Sell a Gift Card</h1>
      <p className="text-muted mb-6" style={{ fontSize: 14 }}>Your code stays encrypted until a buyer pays</p>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        {val > 0 && <GiftCardWidget brand={form.brand} value={val} />}
        {val > 0 && (
          <div className="card">
            <div className="label">Pricing Breakdown</div>
            <div className="flex justify-between mb-2 fs-14"><span className="text-muted">Face Value</span><span>{fmt(val)}</span></div>
            <div className="flex justify-between mb-2 fs-14"><span className="text-muted">Listing Price (70%)</span><span className="text-purple">{fmt(disc)}</span></div>
            <div className="flex justify-between mb-2 fs-14"><span className="text-muted">Commission (10%)</span><span className="text-yellow">-{fmt(comm)}</span></div>
            <div className="divider" />
            <div className="flex justify-between"><span className="fw-700">You Earn</span><span className="fw-700 text-green" style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>{fmt(earn)}</span></div>
            <div className="mt-3">
              <div className="label">Seller Payout</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: "63%" }} /></div>
              <div className="flex justify-between mt-1 fs-12 text-muted"><span>You</span><span>Cardora</span></div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="grid-2">
          <div>
            <label className="label">Brand *</label>
            <select className="input" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}>
              {Object.keys(BRANDS).map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Face Value (₹) *</label>
            <input className="input" type="number" placeholder="e.g. 1000" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Gift Card Code *</label>
          <input className="input" placeholder="e.g. AMZN-XXXX-XXXX-XXXX" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          <div className="fs-12 text-muted mt-1">🔒 Encrypted and hidden until payment is confirmed</div>
        </div>
        <div className="mt-4">
          <label className="label">Expiry Date *</label>
          <input className="input" type="date" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} />
        </div>
        <div className="mt-4">
          <label className="label">Additional Notes</label>
          <input className="input" placeholder="e.g. Valid on all products" />
        </div>

        <div className="glass-purple" style={{ padding: 14, borderRadius: 10, marginTop: 16, fontSize: 13, color: "var(--muted)" }}>
          ✅ Your code will be verified before listing · OTP verification required · Fraud detection active
        </div>

        <button className="btn-primary w-full mt-4" style={{ fontSize: 16, padding: 14 }} onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Listing"}
        </button>
      </div>
    </div>
  );
}

// ── BUYER DASHBOARD ─────────────────────────────────────────────────────────
function BuyerDashboard({ setPage }) {
  const [tab, setTab] = useState("purchases");
  const purchases = [
    { brand: "Amazon", value: 1000, paid: 700, code: "AMZN-7X4K-9M2P", date: "23 May 2026", status: "active" },
    { brand: "Steam", value: 2000, paid: 1400, code: "STM-Q8R3-P1W9", date: "20 May 2026", status: "active" },
    { brand: "Google Play", value: 200, paid: 140, code: "GPLAY-5T8N", date: "15 May 2026", status: "redeemed" },
  ];

  return (
    <div className="flex" style={{ minHeight: "100vh", paddingTop: 68 }}>
      <div className="sidebar">
        <div className="font-display fw-700 mb-6 mt-2" style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Buyer</div>
        {[
          { id: "purchases", icon: "🎁", label: "My Cards" },
          { id: "history", icon: "📋", label: "History" },
          { id: "saved", icon: "💰", label: "Savings" },
          { id: "reviews", icon: "⭐", label: "Reviews" },
        ].map(item => (
          <button key={item.id} className={`sidebar-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
        <div style={{ marginTop: "auto" }}>
          <button className="btn-primary w-full btn-sm" onClick={() => setPage("market")}>Browse More</button>
        </div>
      </div>

      <div className="content-area">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display fw-800" style={{ fontSize: 24 }}>Buyer Dashboard</h1>
            <p className="text-muted fs-13 mt-1">Welcome back, Rohan 👋</p>
          </div>
          <div className="badge badge-green">Verified Buyer</div>
        </div>

        <div className="grid-3 mb-6">
          <StatCard icon="🎁" label="Cards Purchased" value="12" color="#8b5cf6" />
          <StatCard icon="💰" label="Total Saved" value="₹3,840" color="#10b981" trend="vs retail price" />
          <StatCard icon="⭐" label="Avg Rating Given" value="4.8" color="#f59e0b" />
        </div>

        {tab === "purchases" && (
          <div>
            <h2 className="font-display fw-700 mb-4" style={{ fontSize: 16 }}>Your Gift Cards</h2>
            <div className="grid-3">
              {purchases.map((p, i) => (
                <div key={i} className="card" style={{ borderColor: p.status === "active" ? "rgba(16,185,129,0.25)" : "var(--border2)" }}>
                  <div className="flex justify-between mb-3">
                    <div className="badge badge-green" style={{ fontSize: 10 }}>{p.status}</div>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>{p.date}</span>
                  </div>
                  <GiftCardWidget brand={p.brand} value={p.value} small />
                  <div className="mt-3">
                    <div className="label">Your Code</div>
                    <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "var(--green)", background: "rgba(16,185,129,0.08)", padding: "8px 12px", borderRadius: 8, letterSpacing: 1 }}>{p.code}</div>
                  </div>
                  <div className="flex justify-between mt-3 fs-13">
                    <span className="text-muted">Paid {fmt(p.paid)}</span>
                    <span className="text-green">Saved {fmt(p.value - p.paid)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead><tr><th>Card</th><th>Amount Paid</th><th>Saved</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {purchases.map((p, i) => (
                  <tr key={i}>
                    <td><div className="flex items-center gap-2"><span>{BRANDS[p.brand].icon}</span>{p.brand} {fmt(p.value)}</div></td>
                    <td className="fw-600">{fmt(p.paid)}</td>
                    <td className="text-green fw-600">+{fmt(p.value - p.paid)}</td>
                    <td className="text-muted">{p.date}</td>
                    <td><span className={`badge ${p.status === "active" ? "badge-green" : "badge-purple"}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "saved" && (
          <div>
            <div className="stat-card glass mb-4" style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
              <div className="font-display fw-800" style={{ fontSize: 48, color: "var(--green)" }}>₹3,840</div>
              <div className="text-muted mt-2">Total saved vs retail prices</div>
            </div>
            <div className="glass-purple" style={{ padding: 16, borderRadius: 14, fontSize: 14, color: "var(--muted)" }}>
              <b style={{ color: "var(--text)" }}>Pro tip:</b> Subscribe to price alerts to get notified when your favorite brands are listed at extra discount!
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="card">
            <div className="text-center" style={{ padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
              <div className="font-display fw-700" style={{ fontSize: 18 }}>No pending reviews</div>
              <div className="text-muted mt-2">Rate your recent purchases to help others</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SELLER DASHBOARD ────────────────────────────────────────────────────────
function SellerDashboard({ setPage }) {
  const [tab, setTab] = useState("listings");
  const listings = [
    { brand: "Flipkart", value: 500, listed: "22 May 2026", views: 47, status: "active" },
    { brand: "Myntra", value: 750, listed: "18 May 2026", views: 89, status: "sold" },
    { brand: "Swiggy", value: 300, listed: "15 May 2026", views: 23, status: "active" },
  ];

  return (
    <div className="flex" style={{ minHeight: "100vh", paddingTop: 68 }}>
      <div className="sidebar">
        <div className="font-display fw-700 mb-6 mt-2" style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Seller</div>
        {[
          { id: "listings", icon: "📋", label: "Active Listings" },
          { id: "sold", icon: "✅", label: "Sold Cards" },
          { id: "earnings", icon: "💸", label: "Earnings" },
          { id: "withdraw", icon: "🏦", label: "Withdraw" },
        ].map(item => (
          <button key={item.id} className={`sidebar-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
        <div style={{ marginTop: "auto" }}>
          <button className="btn-primary w-full btn-sm" onClick={() => setPage("sell")}>+ New Listing</button>
        </div>
      </div>

      <div className="content-area">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display fw-800" style={{ fontSize: 24 }}>Seller Dashboard</h1>
            <p className="text-muted fs-13 mt-1">priya_s · ⭐ 4.9 (128 reviews)</p>
          </div>
          <div className="badge badge-purple">Top Seller</div>
        </div>

        <div className="grid-4 mb-6">
          <StatCard icon="📋" label="Active Listings" value="2" color="#8b5cf6" />
          <StatCard icon="✅" label="Cards Sold" value="28" color="#10b981" trend="3 this week" />
          <StatCard icon="💰" label="Total Earned" value="₹14,220" color="#06b6d4" />
          <StatCard icon="👜" label="Wallet Balance" value="₹3,780" color="#f59e0b" />
        </div>

        {tab === "listings" && (
          <div>
            <h2 className="font-display fw-700 mb-4" style={{ fontSize: 16 }}>Your Listings</h2>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="table">
                <thead><tr><th>Card</th><th>Listed Price</th><th>Your Earn</th><th>Views</th><th>Listed</th><th>Status</th></tr></thead>
                <tbody>
                  {listings.map((l, i) => (
                    <tr key={i}>
                      <td><div className="flex items-center gap-2"><span>{BRANDS[l.brand].icon}</span>{l.brand} {fmt(l.value)}</div></td>
                      <td className="fw-600 text-purple">{fmt(discounted(l.value))}</td>
                      <td className="fw-600 text-green">{fmt(sellerReceives(l.value))}</td>
                      <td className="text-muted">{l.views} 👁</td>
                      <td className="text-muted">{l.listed}</td>
                      <td><span className={`badge ${l.status === "active" ? "badge-green" : "badge-purple"}`}>{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "earnings" && (
          <div>
            <div className="glass-purple" style={{ padding: 24, borderRadius: 14, marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Total Lifetime Earnings</div>
              <div className="font-display fw-800" style={{ fontSize: 40, color: "var(--purple2)" }}>₹14,220</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>After 10% Cardora commission</div>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="table">
                <thead><tr><th>Card</th><th>Sale Price</th><th>Commission</th><th>You Got</th><th>Date</th></tr></thead>
                <tbody>
                  {[
                    { brand: "Amazon", val: 1000, date: "23 May 2026" },
                    { brand: "Flipkart", val: 500, date: "20 May 2026" },
                    { brand: "Google Play", val: 200, date: "15 May 2026" },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td>{BRANDS[r.brand].icon} {r.brand}</td>
                      <td>{fmt(discounted(r.val))}</td>
                      <td className="text-yellow">-{fmt(commission(r.val))}</td>
                      <td className="fw-700 text-green">{fmt(sellerReceives(r.val))}</td>
                      <td className="text-muted">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "withdraw" && (
          <div style={{ maxWidth: 480 }}>
            <div className="card mb-4" style={{ borderColor: "rgba(16,185,129,0.25)" }}>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Available Balance</div>
              <div className="font-display fw-800 text-green" style={{ fontSize: 36 }}>₹3,780</div>
            </div>
            <div className="card">
              <div className="label">Withdraw To</div>
              <select className="input mb-4">
                <option>UPI ID</option><option>Bank Account</option><option>Paytm Wallet</option>
              </select>
              <div className="label">UPI ID / Account</div>
              <input className="input mb-4" placeholder="yourname@upi" />
              <div className="label">Amount</div>
              <input className="input mb-4" type="number" placeholder="Min ₹100" />
              <button className="btn-primary w-full">Withdraw Now</button>
              <div className="fs-12 text-muted mt-2 text-center">Processed within 24 hours · No withdrawal fees</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="flex" style={{ minHeight: "100vh", paddingTop: 68 }}>
      <div className="sidebar">
        <div className="flex items-center gap-2 mb-6 mt-2">
          <div className="badge badge-red" style={{ fontSize: 10 }}>ADMIN</div>
        </div>
        {[
          { id: "overview", icon: "📊", label: "Overview" },
          { id: "transactions", icon: "💳", label: "Transactions" },
          { id: "users", icon: "👥", label: "Users" },
          { id: "fraud", icon: "🚨", label: "Fraud Reports" },
          { id: "commission", icon: "💰", label: "Commission" },
        ].map(item => (
          <button key={item.id} className={`sidebar-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>

      <div className="content-area">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display fw-800" style={{ fontSize: 24 }}>Admin Control Panel</h1>
            <p className="text-muted fs-13 mt-1">Cardora Platform · Commission UPI: 6360414305@fam</p>
          </div>
          <div className="badge badge-red">Admin Access</div>
        </div>

        {tab === "overview" && <>
          <div className="grid-4 mb-6">
            <StatCard icon="💰" label="Total Revenue" value="₹8.4L" color="#8b5cf6" trend="23% MoM" />
            <StatCard icon="🏦" label="Commission Earned" value="₹84,200" color="#10b981" trend="10% of sales" />
            <StatCard icon="🃏" label="Cards Traded" value="18,420" color="#06b6d4" trend="412 today" />
            <StatCard icon="👥" label="Total Users" value="52,300" color="#f59e0b" trend="840 new today" />
          </div>

          <div className="grid-2 mb-6">
            <div className="card">
              <h3 className="font-display fw-700 mb-4" style={{ fontSize: 15 }}>Top Brands by Volume</h3>
              {[
                { brand: "Amazon", pct: 38, amt: "₹1.2L" },
                { brand: "Flipkart", pct: 24, amt: "₹76K" },
                { brand: "Steam", pct: 18, amt: "₹57K" },
                { brand: "Myntra", pct: 12, amt: "₹38K" },
                { brand: "Others", pct: 8, amt: "₹25K" },
              ].map(b => (
                <div key={b.brand} className="mb-3">
                  <div className="flex justify-between mb-1 fs-13"><span>{BRANDS[b.brand] ? BRANDS[b.brand].icon : "📦"} {b.brand}</span><span className="text-muted">{b.amt}</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: b.pct + "%" }} /></div>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 className="font-display fw-700 mb-4" style={{ fontSize: 15 }}>Platform Health</h3>
              {[
                { label: "Successful Transactions", val: "98.2%", ok: true },
                { label: "Avg Resolution Time", val: "< 2 min", ok: true },
                { label: "Fraud Rate", val: "0.08%", ok: true },
                { label: "Seller Satisfaction", val: "4.7/5", ok: true },
                { label: "Buyer Satisfaction", val: "4.8/5", ok: true },
              ].map(m => (
                <div key={m.label} className="flex justify-between items-center mb-3 fs-14">
                  <span className="text-muted">{m.label}</span>
                  <span className={`fw-700 ${m.ok ? "text-green" : "text-pink"}`}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {tab === "transactions" && (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border2)" }} className="flex justify-between items-center">
              <h3 className="font-display fw-700" style={{ fontSize: 15 }}>All Transactions</h3>
              <input className="input" placeholder="Search..." style={{ width: 200, padding: "8px 12px", fontSize: 13 }} />
            </div>
            <table className="table">
              <thead><tr><th>TXN ID</th><th>Buyer</th><th>Brand</th><th>Amount</th><th>Commission</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {MOCK_TRANSACTIONS.map(t => (
                  <tr key={t.id}>
                    <td className="font-display" style={{ fontSize: 12, color: "var(--purple2)" }}>{t.id}</td>
                    <td className="text-muted">{t.buyer}</td>
                    <td>{BRANDS[t.brand].icon} {t.brand}</td>
                    <td className="fw-600">{fmt(t.amount)}</td>
                    <td className="text-green fw-600">+{fmt(t.commission)}</td>
                    <td className="text-muted">{t.date}</td>
                    <td><span className={`badge ${t.status === "completed" ? "badge-green" : t.status === "pending" ? "badge-yellow" : "badge-red"}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "users" && (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead><tr><th>User</th><th>Role</th><th>Cards</th><th>Volume</th><th>Joined</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  { name: "priya_s", email: "priya@mail.com", role: "seller", cards: 28, vol: "₹19,600", joined: "Jan 2026", status: "verified" },
                  { name: "rohan_k", email: "rohan@mail.com", role: "buyer", cards: 12, vol: "₹8,400", joined: "Feb 2026", status: "verified" },
                  { name: "gamer_x", email: "gamer@mail.com", role: "seller", cards: 8, vol: "₹14,000", joined: "Mar 2026", status: "verified" },
                  { name: "meera99", email: "meera@mail.com", role: "buyer", cards: 5, vol: "₹2,800", joined: "Apr 2026", status: "pending" },
                  { name: "suspect_01", email: "s@anon.com", role: "seller", cards: 0, vol: "₹0", joined: "May 2026", status: "flagged" },
                ].map((u, i) => (
                  <tr key={i}>
                    <td><div className="fw-600">{u.name}</div><div className="fs-12 text-muted">{u.email}</div></td>
                    <td><span className={`badge ${u.role === "seller" ? "badge-purple" : "badge-blue"}`}>{u.role}</span></td>
                    <td>{u.cards}</td>
                    <td className="fw-600">{u.vol}</td>
                    <td className="text-muted">{u.joined}</td>
                    <td><span className={`badge ${u.status === "verified" ? "badge-green" : u.status === "pending" ? "badge-yellow" : "badge-red"}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "fraud" && (
          <div>
            <div className="glass-purple mb-4" style={{ padding: 16, borderRadius: 14 }}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 24 }}>🚨</span>
                <div>
                  <div className="fw-700">1 flagged account detected</div>
                  <div className="fs-13 text-muted mt-1">AI fraud detection found suspicious activity · Review required</div>
                </div>
              </div>
            </div>
            <div className="card" style={{ borderColor: "rgba(239,68,68,0.25)" }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="fw-700">suspect_01 · s@anon.com</div>
                  <div className="fs-13 text-muted mt-1">Multiple failed code verifications · VPN detected · New account</div>
                </div>
                <div className="badge badge-red">High Risk</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary btn-sm" style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}>Suspend Account</button>
                <button className="btn-ghost btn-sm">Review Manually</button>
                <button className="btn-ghost btn-sm">Mark Safe</button>
              </div>
            </div>
          </div>
        )}

        {tab === "commission" && (
          <div style={{ maxWidth: 560 }}>
            <div className="card mb-4" style={{ borderColor: "rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.04)" }}>
              <div className="fs-13 text-muted mb-2">Total Commission Earned (All Time)</div>
              <div className="font-display fw-800 text-green" style={{ fontSize: 40 }}>₹84,200</div>
              <div className="fs-13 text-muted mt-2">Credited to UPI: <b style={{ color: "var(--text)" }}>6360414305@fam</b></div>
            </div>
            <div className="card">
              <div className="label mb-4">Commission Wallet</div>
              {[
                { label: "This Month", val: "₹14,200", pct: "10% of ₹1.42L GMV" },
                { label: "Last Month", val: "₹11,800", pct: "10% of ₹1.18L GMV" },
                { label: "This Year", val: "₹84,200", pct: "Avg 10% commission" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center mb-4">
                  <div>
                    <div className="fw-600 fs-14">{r.label}</div>
                    <div className="fs-12 text-muted">{r.pct}</div>
                  </div>
                  <div className="font-display fw-800 text-green" style={{ fontSize: 20 }}>{r.val}</div>
                </div>
              ))}
              <div className="divider" />
              <div className="flex items-center gap-3 mt-2" style={{ fontSize: 14 }}>
                <span>💳</span>
                <div>
                  <div className="fw-600">Auto-transfer active</div>
                  <div className="fs-12 text-muted">Commission auto-splits to 6360414305@fam on each transaction</div>
                </div>
                <div className="badge badge-green" style={{ marginLeft: "auto" }}>Live</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── AUTH PAGES ──────────────────────────────────────────────────────────────
function AuthPage({ type, setPage, showToast }) {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const isSignup = type === "signup";

  const handle = () => {
    if (!form.email || !form.password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(isSignup ? "Account created! Welcome to Cardora 🎉" : "Logged in successfully!");
      setPage("market");
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, paddingTop: 88 }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div className="card" style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <div className="text-center mb-6">
          <div className="font-display fw-800 grad-text" style={{ fontSize: 28, marginBottom: 6 }}>Cardora</div>
          <h2 className="font-display fw-800" style={{ fontSize: 22 }}>{isSignup ? "Create Account" : "Welcome Back"}</h2>
          <p className="text-muted mt-1" style={{ fontSize: 14 }}>{isSignup ? "Join 52,000+ users on Cardora" : "Sign in to your account"}</p>
        </div>

        <div className="flex gap-2 mb-4">
          {["Google", "Apple"].map(p => (
            <button key={p} className="btn-ghost w-full" style={{ fontSize: 14 }}>
              {p === "Google" ? "🟢" : "🍎"} {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="divider" style={{ flex: 1, margin: 0 }} />
          <span className="fs-12 text-muted">or email</span>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>

        {isSignup && <>
          <label className="label">Full Name</label>
          <input className="input mb-4" placeholder="Priya Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </>}

        <label className="label">Email Address</label>
        <input className="input mb-4" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

        <label className="label">Password</label>
        <input className="input mb-6" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

        <button className="btn-primary w-full" style={{ padding: 14, fontSize: 16 }} onClick={handle} disabled={loading}>
          {loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}
        </button>

        <p className="text-center mt-4 fs-13 text-muted">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button onClick={() => setPage(isSignup ? "login" : "signup")} style={{ background: "none", border: "none", color: "var(--purple2)", cursor: "pointer", fontWeight: 600 }}>
            {isSignup ? "Sign In" : "Sign Up Free"}
          </button>
        </p>

        {isSignup && <p className="text-center mt-3 fs-11 text-muted">By signing up you agree to our Terms & Privacy Policy</p>}
      </div>
    </div>
  );
}

// ── ROOT APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); };
  const hideToast = () => setToast(null);

  const NAV_ITEMS = [
    { id: "landing", label: "Home" },
    { id: "market", label: "Marketplace" },
    { id: "sell", label: "Sell" },
    { id: "buyer", label: "My Purchases" },
    { id: "seller", label: "Seller" },
    { id: "admin", label: "Admin" },
  ];

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <button onClick={() => setPage("landing")} className="nav-logo" style={{ background: "none", border: "none" }}>
          <span className="grad-text">Cardora</span>
        </button>
        <div className="nav-links">
          {NAV_ITEMS.map(n => (
            <button key={n.id} className={`nav-link ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>{n.label}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost btn-sm" onClick={() => setPage("login")}>Login</button>
          <button className="btn-primary btn-sm" onClick={() => setPage("signup")}>Sign Up</button>
        </div>
      </nav>

      {/* PAGES */}
      {page === "landing" && <LandingPage setPage={setPage} />}
      {page === "market" && <Marketplace setPage={setPage} showToast={showToast} />}
      {page === "sell" && <SellPage showToast={showToast} />}
      {page === "buyer" && <BuyerDashboard setPage={setPage} />}
      {page === "seller" && <SellerDashboard setPage={setPage} />}
      {page === "admin" && <AdminDashboard />}
      {page === "login" && <AuthPage type="login" setPage={setPage} showToast={showToast} />}
      {page === "signup" && <AuthPage type="signup" setPage={setPage} showToast={showToast} />}

      {/* TOAST */}
      {toast && <Toast msg={toast} onClose={hideToast} />}
    </>
  );
}
