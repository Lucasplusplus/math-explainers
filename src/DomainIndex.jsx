import { Link } from "react-router-dom";
import { explainers, domains } from "./explainers/registry.js";

export default function DomainIndex({ domainSlug }) {
  const domain = domains.find((d) => d.slug === domainSlug);
  const concepts = explainers.filter((e) => e.domain === domainSlug);

  return (
    <div className="dm-page">
      <style>{`
        .dm-page { background: var(--bg); min-height: 100vh; padding: 48px 20px; }
        .dm { font-family: var(--font); color: var(--ink); max-width: 720px; margin: 0 auto; }
        .dm-back { font-size: 12px; color: var(--mist); text-decoration: none; display: block; margin-bottom: 32px; }
        .dm-back:hover { color: var(--ink); }
        .dm-kicker { font-size: 12px; letter-spacing: 3px; color: var(--mist); font-weight: 700; margin: 0 0 10px; text-transform: uppercase; }
        .dm-title { font-size: 40px; line-height: 1.05; margin: 0 0 32px; font-weight: 700; }
        .dm-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); display: grid; grid-template-columns: 1fr 1fr; column-gap: var(--space-7); }
        @media (max-width: 640px) { .dm-list { grid-template-columns: 1fr; column-gap: 0; } }
        .dm-item { border-bottom: 1px solid var(--line); }
        .dm-link { display: block; padding: 18px 4px; text-decoration: none; color: var(--ink); }
        .dm-link:hover { background: var(--panel); }
        .dm-name { font-size: 19px; font-weight: 700; margin: 0 0 4px; }
        .dm-desc { font-size: 14px; color: var(--mist); margin: 0; }
        .dm-empty { font-size: 14px; color: var(--faint); padding: 18px 4px; border-bottom: 1px solid var(--line); list-style: none; }
      `}</style>
      <div className="dm">
        <Link className="dm-back" to="/explainers">← All Topics</Link>
        <p className="dm-kicker">SAT Math</p>
        <h1 className="dm-title">{domain?.title}</h1>

        <ul className="dm-list">
          {concepts.length > 0 ? (
            concepts.map((e) => (
              <li className="dm-item" key={e.slug}>
                <Link className="dm-link" to={`/${domainSlug}/${e.slug}`}>
                  <p className="dm-name">{e.title}</p>
                  <p className="dm-desc">{e.description}</p>
                </Link>
              </li>
            ))
          ) : (
            <li className="dm-empty">[concepts coming soon]</li>
          )}
        </ul>
      </div>
    </div>
  );
}
