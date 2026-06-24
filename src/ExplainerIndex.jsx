import { Link } from "react-router-dom";
import { explainers } from "./explainers/registry.js";

export default function ExplainerIndex() {
  return (
    <div className="ix-page">
      <style>{`
        .ix-page { background: var(--bg); min-height: 100vh; padding: 48px 20px; }
        .ix { font-family: var(--font); color: var(--ink); max-width: 720px; margin: 0 auto; }
        .ix-kicker { font-size: 12px; letter-spacing: 3px; color: var(--mist); font-weight: 700; margin: 0 0 10px; text-transform: uppercase; }
        .ix-title { font-size: 40px; line-height: 1.05; margin: 0 0 12px; font-weight: 700; }
        .ix-dek { font-size: 16px; color: var(--mist); margin: 0 0 32px; line-height: 1.45; }
        .ix-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
        .ix-item { border-bottom: 1px solid var(--line); }
        .ix-link { display: block; padding: 18px 4px; text-decoration: none; color: var(--ink); }
        .ix-link:hover { background: var(--panel); }
        .ix-name { font-size: 19px; font-weight: 700; margin: 0 0 4px; }
        .ix-desc { font-size: 14px; color: var(--mist); margin: 0; }
      `}</style>
      <div className="ix">
        <p className="ix-kicker">[SERIES LABEL]</p>
        <h1 className="ix-title">[Series title]</h1>
        <p className="ix-dek">[one-line description of the series]</p>

        <ul className="ix-list">
          {explainers.map((e) => (
            <li className="ix-item" key={e.slug}>
              <Link className="ix-link" to={`/${e.slug}`}>
                <p className="ix-name">{e.title}</p>
                <p className="ix-desc">{e.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
