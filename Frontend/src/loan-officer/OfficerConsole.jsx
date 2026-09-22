// ============================================================
// Setu Credit — loan officer console
//
//   import OfficerConsole from "./loan-officer/OfficerConsole.jsx";
//   <OfficerConsole />
//
// Optional props to wire it to your backend:
//   officer          { name, title }
//   initialTypes     product array  (defaults to SEED_TYPES)
//   initialApps      application array (defaults to SEED_APPS)
//   bureauRecords    bureau array  (defaults to BUREAU)
//   onDecide(app, status, note)     called after an approve / decline
//   onSaveProduct(product)          called after a rate or limit change
//   onSignOut()                     shows the account chip as a button
// ============================================================
/* eslint-disable react-hooks/static-components */
import { useCallback, useEffect, useMemo, useState } from "react";
import "./officer.css";

import { BUREAU, OFFICER, SEED_APPS, SEED_TYPES } from "./data.js";
import { band, emi, fmtDate, initials, lakh, money, tenureText, typeById, bureauFor } from "./utils.js";
import { BureauIcon, CatalogIcon, ManageIcon, QueueIcon, SunIcon } from "./icons.jsx";
import ApplicationSheet from "./ApplicationSheet.jsx";
import EditProductSheet from "./EditProductSheet.jsx";

const NAV = [
  { group: "Underwriting", items: [
    { id: "queue", label: "Application queue", Icon: QueueIcon, pip: "pending" },
    { id: "bureau", label: "Credit bureau", Icon: BureauIcon },
  ]},
  { group: "Products", items: [
    { id: "types", label: "Loan products", Icon: CatalogIcon },
    { id: "manage", label: "Rates & limits", Icon: ManageIcon },
  ]},
];

export default function OfficerConsole({
  officer = OFFICER,
  initialTypes,
  initialApps,
  bureauRecords = BUREAU,
  onDecide,
  onSaveProduct,
  onSignOut,
}) {
  const [types, setTypes] = useState(() => initialTypes || JSON.parse(JSON.stringify(SEED_TYPES)));
  const [apps, setApps] = useState(() => initialApps || JSON.parse(JSON.stringify(SEED_APPS)));
  const [view, setView] = useState("queue");
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "score", dir: -1 });
  const [openAppId, setOpenAppId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [theme, setTheme] = useState(null); // null = follow the system
  const [toasts, setToasts] = useState([]);

  const bureau = bureauRecords;

  const toast = useCallback((text, kind) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setOpenAppId(null); setEditId(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => ({
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    declined: apps.filter((a) => a.status === "declined").length,
  }), [apps]);

  /* ---------------- actions ---------------- */

  function decide(id, status, note) {
    let updated = null;
    setApps((list) =>
      list.map((a) => {
        if (a.id !== id || a.status !== "pending") return a;
        updated = {
          ...a,
          status,
          decidedBy: officer.name,
          decidedOn: new Date().toISOString(),
          note: note || "Sanctioned on card terms.",
        };
        return updated;
      })
    );
    setOpenAppId(null);
    if (updated) {
      const who = bureauFor(bureau, updated.pan);
      toast(
        (status === "approved" ? "Approved " : "Declined ") + id + " for " + (who ? who.name : "the applicant"),
        status === "approved" ? "good" : "bad"
      );
      if (onDecide) onDecide(updated, status, note);
    }
  }

  function saveProduct(id, patch) {
    let updated = null;
    setTypes((list) =>
      list.map((t) => {
        if (t.id !== id) return t;
        updated = { ...t, ...patch };
        return updated;
      })
    );
    setEditId(null);
    if (updated) {
      toast(updated.name + " updated — the public page now shows " + updated.rate.toFixed(2) + "%.", "good");
      if (onSaveProduct) onSaveProduct(updated);
    }
  }

  function resetProducts() {
    setTypes(JSON.parse(JSON.stringify(SEED_TYPES)));
    toast("Product settings restored to the published card rates.");
  }

  function toggleTheme() {
    const dark = theme
      ? theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(dark ? "light" : "dark");
  }

  /* ---------------- views ---------------- */

  const openApp = openAppId ? apps.find((a) => a.id === openAppId) : null;
  const editProduct = editId ? types.find((t) => t.id === editId) : null;

  function ApplicationRow({ app }) {
    const t = typeById(types, app.type);
    const b = bureauFor(bureau, app.pan) || { name: "Unknown", score: 0 };
    const instalment = emi(app.amount, t.rate, app.tenure);
    const bd = band(b.score);
    return (
      <button className="app" onClick={() => setOpenAppId(app.id)}>
        <div>
          <div className="lead">
            <h3>{b.name}</h3>
            <span className={"tag " + app.status}>
              {app.status[0].toUpperCase() + app.status.slice(1)}
            </span>
            {!!b.score && (
              <span className="tag plain" style={{ color: bd.color }}>
                {b.score} · {bd.name}
              </span>
            )}
          </div>
          <div className="sub">
            {t.name} · {app.id} · {tenureText(app.tenure)} at {t.rate.toFixed(2)}% · {money(instalment)}/mo ·{" "}
            {app.status === "pending"
              ? "submitted " + fmtDate(app.submitted)
              : (app.status === "approved" ? "approved " : "declined ") + fmtDate(app.decidedOn)}
          </div>
        </div>
        <div className="amt">
          <span className="money">{lakh(app.amount)}</span>
          <span>requested</span>
        </div>
      </button>
    );
  }

  function QueueView() {
    const q = search.trim().toLowerCase();
    const list = apps
      .filter((a) => {
        if (filter !== "all" && a.status !== filter) return false;
        if (!q) return true;
        const b = bureauFor(bureau, a.pan) || { name: "" };
        return (a.id + " " + b.name + " " + a.pan + " " + typeById(types, a.type).name)
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => new Date(b.submitted) - new Date(a.submitted));

    const chips = [
      ["pending", "Pending " + counts.pending],
      ["approved", "Approved " + counts.approved],
      ["declined", "Declined " + counts.declined],
      ["all", "All " + apps.length],
    ];

    return (
      <>
        <div className="pagehead">
          <div>
            <h1>Application queue</h1>
            <p>
              {counts.pending} waiting on a decision. Open one to see the bureau record and the
              policy checks side by side.
            </p>
          </div>
        </div>

        <div className="filters">
          {chips.map(([key, label]) => (
            <button
              key={key}
              className="fchip"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
          <input
            className="search"
            placeholder="Search name, PAN or reference"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {list.length ? (
          <div className="applist">
            {list.map((a) => <ApplicationRow key={a.id} app={a} />)}
          </div>
        ) : (
          <div className="empty">
            <h3>Queue is clear</h3>
            <p>No application matches this filter. Switch to All to see the full history of the desk.</p>
            <button className="btn" onClick={() => setFilter("all")}>Show all</button>
          </div>
        )}
      </>
    );
  }

  function BureauView() {
    const q = search.trim().toLowerCase();
    const rows = bureau
      .filter((b) => !q || (b.name + " " + b.pan + " " + b.employer).toLowerCase().includes(q))
      .slice()
      .sort((a, b) => {
        const va = a[sort.key], vb = b[sort.key];
        return (typeof va === "string" ? va.localeCompare(vb) : va - vb) * sort.dir;
      });

    const sortBy = (key) =>
      setSort((s) => ({
        key,
        dir: s.key === key ? -s.dir : typeof bureau[0][key] === "string" ? 1 : -1,
      }));

    const Th = ({ k, label, num }) => (
      <th className={"sortable" + (num ? " num" : "")} onClick={() => sortBy(k)}>
        {label}
        {sort.key === k ? (sort.dir === 1 ? " ↑" : " ↓") : ""}
      </th>
    );

    return (
      <>
        <div className="pagehead">
          <div>
            <h1>Credit bureau</h1>
            <p>Pulled from the bureau on file. Read-only for everyone — scores are never edited at the branch.</p>
          </div>
          <div className="spacer" />
          <input
            className="search"
            placeholder="Search name or PAN"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <Th k="name" label="Applicant" />
                <th>PAN</th>
                <Th k="score" label="Score" />
                <Th k="accounts" label="Open accounts" num />
                <Th k="enquiries" label="Enquiries 6m" num />
                <Th k="dpd" label="Missed payments" num />
                <Th k="util" label="Utilisation" num />
                <Th k="updated" label="Last refreshed" />
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => {
                const bd = band(b.score);
                const open = apps.filter((a) => a.pan === b.pan && a.status === "pending").length;
                return (
                  <tr key={b.pan}>
                    <td>
                      <b style={{ fontWeight: 600 }}>{b.name}</b>
                      <div className="label">
                        {b.employer}{open ? ` · ${open} pending` : ""}
                      </div>
                    </td>
                    <td className="pan">{b.pan}</td>
                    <td>
                      <div className="bandbar">
                        <b style={{ color: bd.color }}>{b.score}</b>
                        <span className="track">
                          <span className="fill" style={{ width: (bd.pct * 100).toFixed(0) + "%", background: bd.color }} />
                        </span>
                        <span className="label">{bd.name}</span>
                      </div>
                    </td>
                    <td className="num">{b.accounts}</td>
                    <td className="num" style={b.enquiries >= 4 ? { color: "var(--clay)", fontWeight: 600 } : undefined}>{b.enquiries}</td>
                    <td className="num" style={b.dpd > 0 ? { color: "var(--clay)", fontWeight: 600 } : undefined}>{b.dpd}</td>
                    <td className="num" style={b.util > 70 ? { color: "var(--clay)", fontWeight: 600 } : undefined}>{b.util}%</td>
                    <td className="label">{fmtDate(b.updated)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="label" style={{ marginTop: 12 }}>
          Scores follow the 300–900 scale. 780 and above is excellent, below 680 needs a
          compensating factor such as collateral or a co-applicant.
        </p>
      </>
    );
  }

  function ProductsView() {
    return (
      <>
        <div className="pagehead">
          <div>
            <h1>Loan products</h1>
            <p>Current card rates. Use Rates &amp; limits to change any of these.</p>
          </div>
        </div>
        <div className="types">
          {types.map((t) => (
            <article key={t.id} className={"type" + (t.active ? "" : " off")} style={{ "--accent": t.accent }}>
              <h3>
                {t.name}
                {!t.active && <span className="tag plain">Paused</span>}
              </h3>
              <p className="tagline">{t.tagline}</p>
              <div className="rate">
                <b>{t.rate.toFixed(2)}<span style={{ fontSize: 18 }}>%</span></b>
                <span>per annum, reducing balance</span>
              </div>
              <dl className="specs">
                <div><dt>Amount</dt><dd>{lakh(t.min)} – {lakh(t.max)}</dd></div>
                <div><dt>Tenure</dt><dd>{tenureText(t.tenMin)} – {tenureText(t.tenMax)}</dd></div>
                <div><dt>Score needed</dt><dd>{t.minScore}+</dd></div>
                <div><dt>Processing fee</dt><dd>{t.fee}%</dd></div>
              </dl>
              <div className="cta">
                <button className="btn sm" onClick={() => setEditId(t.id)}>Edit rate &amp; limits</button>
              </div>
            </article>
          ))}
        </div>
      </>
    );
  }

  function ManageView() {
    return (
      <>
        <div className="pagehead">
          <div>
            <h1>Rates &amp; limits</h1>
            <p>Changes here appear immediately on the public product page and in every new quote.</p>
          </div>
          <div className="spacer" />
          <button className="btn" onClick={resetProducts}>Reset to card rates</button>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th className="num">Rate</th>
                <th>Amount range</th>
                <th>Tenure</th>
                <th className="num">Score floor</th>
                <th className="num">Fee</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.id}>
                  <td>
                    <b style={{ fontWeight: 600 }}>{t.name}</b>
                    <div className="label">{t.tagline.slice(0, 42)}…</div>
                  </td>
                  <td className="num"><b style={{ fontWeight: 600 }}>{t.rate.toFixed(2)}%</b></td>
                  <td>{lakh(t.min)} – {lakh(t.max)}</td>
                  <td>{tenureText(t.tenMin)} – {tenureText(t.tenMax)}</td>
                  <td className="num">{t.minScore}</td>
                  <td className="num">{t.fee}%</td>
                  <td><span className={"tag " + (t.active ? "approved" : "plain")}>{t.active ? "Live" : "Paused"}</span></td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn sm" onClick={() => setEditId(t.id)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  const views = { queue: QueueView, bureau: BureauView, types: ProductsView, manage: ManageView };
  const Current = views[view] || QueueView;

  /* ---------------- shell ---------------- */

  return (
    <div className="officer-console" data-theme={theme || undefined}>
      <header className="topbar">
        <div className="brand">
          <div className="mark" aria-hidden="true">से</div>
          <div>
            <b>Setu Credit</b> <span>Retail lending desk · Andheri E, Mumbai</span>
          </div>
        </div>
        <div className="session">
          <button className="icobtn" onClick={toggleTheme} title="Switch theme" aria-label="Switch theme">
            <SunIcon />
          </button>
          <button className="who" onClick={onSignOut} disabled={!onSignOut}>
            <span className="avatar off">{initials(officer.name)}</span>
            <span>
              <small>Loan officer</small>
              <strong>{officer.name}</strong>
            </span>
          </button>
        </div>
      </header>

      <div className="shell">
        <nav className="rail" aria-label="Sections">
          {NAV.map((g) => (
            <div className="railgroup" key={g.group}>
              <div className="railtitle">{g.group}</div>
              {g.items.map(({ id, label, Icon, pip }) => (
                <button
                  key={id}
                  className="navitem"
                  aria-current={view === id ? "page" : undefined}
                  onClick={() => { setView(id); setSearch(""); }}
                >
                  <Icon />
                  <span>{label}</span>
                  {pip === "pending" && counts.pending > 0 && (
                    <span className="pip">{counts.pending}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
          <div className="railnote">
            You are signed in with approval rights. Rate changes and decisions are recorded against
            your name.
          </div>
        </nav>

        <main>
          <Current />
        </main>
      </div>

      {openApp && (
        <ApplicationSheet
          app={openApp}
          types={types}
          bureau={bureau}
          onClose={() => setOpenAppId(null)}
          onDecide={decide}
        />
      )}

      {editProduct && (
        <EditProductSheet
          product={editProduct}
          onClose={() => setEditId(null)}
          onSave={saveProduct}
        />
      )}

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={"toast" + (t.kind ? " " + t.kind : "")}>{t.text}</div>
        ))}
      </div>
    </div>
  );
}
