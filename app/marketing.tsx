import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@remix-run/react";
import { BRAND, OPERATOR, SITE_URL } from "./content/brand";
import marketingStyles from "./styles/pseo.css?url";

export const marketingLinks = () => [{ rel: "stylesheet", href: marketingStyles }];

const NAV_LINKS = [
  { to: "/migrate/", label: "Migrate" },
  { to: "/shopify-store-migration/", label: "Store Migration" },
  { to: "/compare/", label: "Compare" },
  { to: "/tools/", label: "Tools" },
  { to: "/learn/", label: "Learn" },
] as const;

function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav">
      <div className="nav__in">
        <Link to="/" className="brand">
          <span className="brand__icon">P</span>
          {BRAND.name}
        </Link>

        <nav className="nav__links">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav__right">
          <Link className="btn btn--primary btn--sm" to="/tools/migration-assessment/">
            Free assessment
          </Link>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="nav-mobile"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={`nav__burger-box${open ? " is-open" : ""}`}>
              <i /><i /><i />
            </span>
          </button>
        </div>
      </div>

      <div id="nav-mobile" className={`nav__mobile${open ? " is-open" : ""}`} hidden={!open}>
        <nav>
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn--primary" to="/tools/migration-assessment/" onClick={() => setOpen(false)}>
          Free migration assessment
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__cols">
          <div>
            <Link to="/" className="brand">
              <span className="brand__icon">P</span>
              {BRAND.name}
            </Link>
            <p style={{ color: "var(--ink-3)", fontSize: 14, maxWidth: "34ch", marginTop: 14 }}>
              Technical migration intelligence for established ecommerce stores moving to Shopify.
            </p>
          </div>

          <div>
            <h4>Migrate</h4>
            <ul>
              <li><Link to="/migrate/woocommerce-to-shopify/">WooCommerce</Link></li>
              <li><Link to="/migrate/magento-to-shopify/">Magento</Link></li>
              <li><Link to="/migrate/bigcommerce-to-shopify/">BigCommerce</Link></li>
              <li><Link to="/migrate/vtex-to-shopify/">VTEX</Link></li>
              <li><Link to="/migrate/prestashop-to-shopify/">PrestaShop</Link></li>
              <li><Link to="/migrate/">All platforms</Link></li>
            </ul>
          </div>

          <div>
            <h4>Problems</h4>
            <ul>
              <li><Link to="/migrate/order-history/">Order history</Link></li>
              <li><Link to="/migrate/seo/">SEO migration</Link></li>
              <li><Link to="/migrate/redirects/">URL redirects</Link></li>
              <li><Link to="/migrate/customer-passwords/">Customer passwords</Link></li>
              <li><Link to="/migrate/subscriptions/">Subscriptions</Link></li>
              <li><Link to="/migrate/reviews/">Product reviews</Link></li>
              <li><Link to="/migrate/b2b/">B2B migration</Link></li>
            </ul>
          </div>

          <div>
            <h4>Tools</h4>
            <ul>
              <li><Link to="/tools/migration-assessment/">Migration assessment</Link></li>
              <li><Link to="/shopify-store-migration/">Store Migration guide</Link></li>
              <li><Link to="/compare/">Tool comparisons</Link></li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/learn/">Knowledge base</Link></li>
              <li><a href={`mailto:${OPERATOR.contactEmail}`}>{OPERATOR.contactEmail}</a></li>
            </ul>
          </div>
        </div>

        <div className="foot__legal">
          <p style={{ margin: "0 0 8px" }}>
            Built and operated by {OPERATOR.legalName} in {OPERATOR.country}. &copy; {new Date().getFullYear()} {BRAND.name}.
          </p>
          <p style={{ margin: 0 }}>
            {BRAND.name} is an independent resource and is not affiliated with, endorsed by, or sponsored by Shopify, WooCommerce, Magento, or any platform mentioned.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Marketing({ children }: { children: ReactNode }) {
  return (
    <div className="m">
      <Nav />
      {children}
      <Footer />
    </div>
  );
}

/**
 * A CTA band that appears at the bottom of content pages.
 */
export function MigrationCTA({
  headline = "Planning a Shopify migration?",
  body = "Get a free assessment of your store's migration complexity, risks, and effort.",
  buttonLabel = "Assess my store",
  source = "cta",
}: {
  headline?: string;
  body?: string;
  buttonLabel?: string;
  source?: string;
}) {
  return (
    <div className="cta-band" style={{ marginTop: 48 }}>
      <span className="cta-band__eyebrow">Free assessment</span>
      <h2>{headline}</h2>
      <p>{body}</p>
      <Link to={`/tools/migration-assessment/?source=${source}`} className="btn btn--primary btn--lg">
        {buttonLabel}
      </Link>
    </div>
  );
}
