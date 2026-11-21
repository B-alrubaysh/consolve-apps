export function CheckIcon() {
  return (
    <svg className="dt1-check-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

export function SortIcon() {
  return (
    <svg className="dt1-sort-ind" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
    </svg>
  );
}

export function Checkbox({ checked, indeterminate, onChange, label }) {
  return (
    <label className="dt1-check" onClick={(e) => e.stopPropagation()}>
      <input
        type="checkbox"
        className="dt1-check-input"
        checked={checked}
        ref={(el) => { if (el) el.indeterminate = !!indeterminate; }}
        onChange={onChange}
        aria-label={label}
      />
      <span className="dt1-check-box" aria-hidden="true"><CheckIcon /></span>
    </label>
  );
}

export function BeamButton({ children, onClick, disabled, className = "" }) {
  return (
    <button type="button" className={`dt1-btn dt1-btn--beam ${className}`} onClick={onClick} disabled={disabled}>
      <span className="dt1-beam-track" aria-hidden="true"><span className="dt1-beam" /></span>
      {children}
    </button>
  );
}