import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { nav } from "./motion.js";
import { domains } from "./explainers/registry.js";

export default function ExplainerIndex() {
  return (
    <div className="ix-page">
      <div className="ix">
        <p className="ix-kicker">SAT Math</p>
        <h1 className="ix-title">Concepts</h1>

        <ul className="ix-list">
          {domains.map((d) => (
            <li className="ix-item" key={d.slug}>
              <Link className="ix-link" to={`/${d.slug}`}>
                <div className="ix-info">
                  <motion.p
                    className="ix-name"
                    layoutId={`domain-title-${d.slug}`}
                    transition={{ duration: nav.layoutDur, ease: nav.easeOut }}
                  >
                    {d.title}
                  </motion.p>
                  <p className="ix-desc">{d.description}</p>
                </div>
                <span className="ix-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
