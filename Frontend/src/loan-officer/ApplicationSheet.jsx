// ============================================================
// Setu Credit — application review sheet
// Bureau record + policy checks + the approve / decline decision.
// ============================================================
import { useState } from "react";
import { CloseIcon, ScoreArc } from "./icons.jsx";
import { assess, band, fmtDateTime, lakh, money, tenureText } from "./utils.js";

export default function ApplicationSheet({ app, types, bureau, onClose, onDecide }) {
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState(false);

  if (!app) return null;

  const { type, bureau: record, emi: instalment, foir, checks } = assess(app, types, bureau);
  const failed = checks.filter((c) => !c.ok).length;
  const bd = record ? band(record.score) : null;
  const statusLabel = app.status[0].toUpperCase() + app.status.slice(1);

  function decide(status) {
    const text = note.trim();
    if (status === "declined" && !text) {
      setNoteError(true);
      return;
    }
    onDecide(app.id, status, text);
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet wide" role="dialog" aria-modal="true" aria-label="Application review">
        <div className="sheethead">
          <div>
            <h2>{type.name} · {lakh(app.amount)}</h2>
            <p>
              {app.id} · {record ? record.name : "Unknown"} · submitted {fmtDateTime(app.submitted)}
            </p>
          </div>
          <button className="icobtn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <span className={"tag " + app.status} style={{ marginBottom: 14 }}>{statusLabel}</span>

        <div className="sumrow"><span>Instalment</span><b>{money(instalment)} / month</b></div>
        <div className="sumrow"><span>Tenure</span><b>{tenureText(app.tenure)} at {type.rate.toFixed(2)}%</b></div>
        <div className="sumrow"><span>Total repayable</span><b>{money(instalment * app.tenure)}</b></div>
        <div className="sumrow"><span>Processing fee</span><b>{money((app.amount * type.fee) / 100)}</b></div>
        <div className="sumrow">
          <span>Share of monthly income</span>
          <b style={{ color: foir > 50 ? "var(--clay)" : "var(--teal)" }}>{foir.toFixed(0)}%</b>
        </div>

        <hr className="hr" />
        <p className="label" style={{ marginBottom: 6 }}>Stated purpose</p>
        <p style={{ fontSize: 14, lineHeight: 1.55 }}>{app.purpose}</p>

        <hr className="hr" />
        <p className="label" style={{ marginBottom: 10 }}>Bureau record</p>
        {record ? (
          <div className="gauge" style={{ marginBottom: 16 }}>
            <ScoreArc score={record.score} color={bd.color} />
            <div>
              <div className="val" style={{ color: bd.color }}>{record.score}</div>
              <div className="bandname" style={{ color: bd.color }}>{bd.name}</div>
              <div className="out">
                {record.dpd} missed · {record.enquiries} enquiries · {record.util}% used
              </div>
            </div>
          </div>
        ) : (
          <p className="label" style={{ marginBottom: 16 }}>No bureau record found for this PAN.</p>
        )}

        <p className="label" style={{ marginBottom: 10 }}>
          Policy checks — {failed ? `${failed} of ${checks.length} not met` : "all clear"}
        </p>
        <div className="checks">
          {checks.map((c, i) => (
            <div key={i} className={"check " + (c.ok ? "pass" : "fail")}>
              <span className="dot">{c.ok ? "✓" : "!"}</span>
              <span>
                <b>{c.label}</b>
                <span className="detail">{c.detail}</span>
              </span>
            </div>
          ))}
        </div>

        {app.status !== "pending" && (
          <>
            <hr className="hr" />
            <p className="label" style={{ marginBottom: 10 }}>Decision</p>
            <ul className="timeline">
              <li>
                <span className="node on" />
                <span><b>Submitted</b><span>{fmtDateTime(app.submitted)}</span></span>
              </li>
              <li>
                <span className={"node " + (app.status === "approved" ? "ok" : "no")} />
                <span>
                  <b>{app.status === "approved" ? "Approved" : "Declined"} by {app.decidedBy || "the desk"}</b>
                  <span>{fmtDateTime(app.decidedOn)}</span>
                  {app.note && (
                    <span style={{ color: "var(--ink-soft)", marginTop: 5 }}>{app.note}</span>
                  )}
                </span>
              </li>
            </ul>
          </>
        )}

        {app.status === "pending" && (
          <>
            <hr className="hr" />
            <div className="field" style={{ marginBottom: 10 }}>
              <label htmlFor="decision-note">
                Note to the applicant <span className="hint">shown with the decision</span>
              </label>
              <textarea
                id="decision-note"
                className="input"
                value={note}
                aria-invalid={noteError || undefined}
                onChange={(e) => { setNote(e.target.value); setNoteError(false); }}
                placeholder={
                  failed
                    ? "Explain what would change the outcome."
                    : "Anything the applicant should know about the sanction."
                }
              />
              {noteError && (
                <div className="err">A declined application needs a reason for the applicant.</div>
              )}
            </div>
            <div className="sheetactions">
              <button className="btn approve" onClick={() => decide("approved")}>Approve loan</button>
              <button className="btn decline" onClick={() => decide("declined")}>Decline</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
