import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { nav } from "./motion.js";
import { explainers, domains } from "./explainers/registry.js";

export default function DomainIndex({ domainSlug }) {
  const domain = domains.find((d) => d.slug === domainSlug);
  const concepts = explainers.filter((e) => e.domain === domainSlug);

  return (
    <div className="dm-page">
      <div className="dm">
        <Link className="dm-back" to="/explainers">← All Topics</Link>
        <p className="dm-kicker">SAT Math</p>
        <motion.h1
          className="dm-title"
          layoutId={`domain-title-${domainSlug}`}
          transition={{ duration: nav.layoutDur, ease: nav.easeOut }}
        >
          {domain?.title}
        </motion.h1>

        <ul className="dm-list">
          {concepts.length > 0 ? (
            concepts.map((e) => (
              <li className="dm-item" key={e.slug}>
                <Link className="dm-link" to={`/${domainSlug}/${e.slug}`}>
                  <div className="dm-info">
                    <motion.p
                      className="dm-name"
                      layoutId={`concept-title-${e.slug}`}
                      transition={{ duration: nav.layoutDur, ease: nav.easeOut }}
                    >
                      {e.title}
                    </motion.p>
                    <p className="dm-desc">{e.description}</p>
                  </div>
                  <span className="dm-arrow" aria-hidden="true">→</span>
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
