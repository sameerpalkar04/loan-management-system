import "./interest-rate.css";

export default function InterestRate({ value, showMarker = true }) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  return (
    <span className="interest-rate">
      <span className="interest-rate__value">
        {numericValue.toFixed(2)}
      </span>
      <span className="interest-rate__percent">%</span>
      {showMarker && <sup className="interest-rate__marker">*</sup>}
      <span className="interest-rate__annual">p.a.</span>
    </span>
  );
}
