import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { BRAND, OPERATOR, AUTHOR, SITE_URL } from "./content/brand";

export default function App() {
  const organization = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: BRAND.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        description: BRAND.shortDescription,
        publisher: { "@id": `${SITE_URL}/#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free migration assessment available",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: OPERATOR.tradingName,
        legalName: OPERATOR.legalName,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        email: OPERATOR.contactEmail,
        address: { "@type": "PostalAddress", addressCountry: OPERATOR.countryCode },
        founder: { "@id": `${SITE_URL}/#founder` },
        sameAs: [OPERATOR.linkedin, OPERATOR.github],
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#founder`,
        name: AUTHOR.name,
        jobTitle: AUTHOR.jobTitle,
        url: AUTHOR.url,
        sameAs: [AUTHOR.linkedin, AUTHOR.github],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <meta name="theme-color" content="#2563eb" />

        {/* Social card defaults */}
        <meta property="og:site_name" content={BRAND.name} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${SITE_URL}/og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${SITE_URL}/og.png`} />

        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
