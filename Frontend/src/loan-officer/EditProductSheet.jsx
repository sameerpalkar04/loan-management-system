// ============================================================
// Setu Credit — rates & limits editor (officer only)
// Saved changes are what the public product page reads.
// ============================================================
import { useState } from "react";
import { CloseIcon } from "./icons.jsx";

export default function EditProductSheet({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    rate: product.rate,
    fee: product.fee,
    min: product.min,
    max: product.max,
    tenMin: product.tenMin,
    tenMax: product.tenMax,
    minScore: product.minScore,
    active: product.active ? "1" : "0",
  });
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function submit() {
    const rate = +form.rate, fee = +form.fee;
    const min = +form.min, max = +form.max;
    const tenMin = +form.tenMin, tenMax = +form.tenMax;
    const minScore = +form.minScore;

    if (!(rate > 0 && rate < 40)) return setError("Rate must be between 0 and 40%.");
    if (min >= max) return setError("Maximum amount has to be larger than the minimum.");
    if (tenMin >= tenMax) return setError("Maximum tenure has to be longer than the minimum.");
    if (minScore < 300 || minScore > 900) return setError("Score floor sits on the 300–900 scale.");

    setError("");
    onSave(product.id, {
      rate, fee, min, max, tenMin, tenMax, minScore,
      active: form.active === "1",
    });
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={"Edit " + product.name}>
        <div className="sheethead">
          <div>
            <h2>{product.name}</h2>
            <p>Saved changes take effect on the public page straight away.</p>
          </div>
          <button className="icobtn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="two">
          <div className="field">
            <label htmlFor="p-rate">Interest rate (% p.a.)</label>
            <input id="p-rate" className="input" type="number" step="0.05" min="1" max="40" value={form.rate} onChange={set("rate")} />
          </div>
          <div className="field">
            <label htmlFor="p-fee">Processing fee (%)</label>
            <input id="p-fee" className="input" type="number" step="0.05" min="0" max="5" value={form.fee} onChange={set("fee")} />
          </div>
        </div>

        <div className="two">
          <div className="field">
            <label htmlFor="p-min">Minimum amount (₹)</label>
            <input id="p-min" className="input" type="number" step="10000" value={form.min} onChange={set("min")} />
          </div>
          <div className="field">
            <label htmlFor="p-max">Maximum amount (₹)</label>
            <input id="p-max" className="input" type="number" step="10000" value={form.max} onChange={set("max")} />
          </div>
        </div>

        <div className="two">
          <div className="field">
            <label htmlFor="p-tmin">Min tenure (months)</label>
            <input id="p-tmin" className="input" type="number" step="6" min="3" value={form.tenMin} onChange={set("tenMin")} />
          </div>
          <div className="field">
            <label htmlFor="p-tmax">Max tenure (months)</label>
            <input id="p-tmax" className="input" type="number" step="6" max="360" value={form.tenMax} onChange={set("tenMax")} />
          </div>
        </div>

        <div className="two">
          <div className="field">
            <label htmlFor="p-score">Credit score floor</label>
            <input id="p-score" className="input" type="number" step="5" min="300" max="900" value={form.minScore} onChange={set("minScore")} />
          </div>
          <div className="field">
            <label htmlFor="p-active">Availability</label>
            <select id="p-active" className="input" value={form.active} onChange={set("active")}>
              <option value="1">Live — accepting applications</option>
              <option value="0">Paused</option>
            </select>
          </div>
        </div>

        {error && <div className="err">{error}</div>}

        <div className="sheetactions">
          <button className="btn primary" onClick={submit}>Save changes</button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
