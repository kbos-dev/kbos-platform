import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/runtime-infrastructure", label: "Infrastructure" },
  { href: "/banking-runtime", label: "Banking" },
  { href: "/healthcare-runtime", label: "Healthcare" },
  { href: "/proof-and-replay", label: "Proof + Replay" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/products/equipment-finance-decision-review", label: "Equipment Finance" }
];

export function PublicNavigation() {
  return (
    <header className="kbos-nav">
      <div className="kbos-nav-inner">
        <div className="kbos-brand-row">
          <Link href="/">
            <Image
              src="/brand/m08/M08_PRIMARY_LOGO_LIGHT.png"
              alt="KBOS"
              width={188}
              height={71}
              priority
              className="kbos-brand-img"
            />
          </Link>

          <div className="kbos-brand-copy">
            <div className="kbos-brand-kicker">
              Operational Continuity Platform
            </div>
            <div className="kbos-brand-sub">
              Replayable | Reviewable | Human Governed
            </div>
          </div>
        </div>

        <nav className="kbos-nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="kbos-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="kbos-nav-actions">
          <div className="kbos-pill">Pilot Ready</div>
          <Link href="/request-demo" className="kbos-button-primary">
            Request Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
