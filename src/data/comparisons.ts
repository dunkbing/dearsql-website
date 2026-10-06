import { FREE_SAVED_CONNECTIONS } from "./limits";

export interface Row {
  feature: string;
  dearsql: string;
  competitor: string;
  highlight?: boolean;
}

export interface ComparisonData {
  architecture: Row[];
  databases: Row[];
  platforms: Row[];
  features: Row[];
  pricing: Row[];
}

export interface Competitor {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  title: string;
  description: string;
  faq: Array<{ q: string; a: string }>;
  sources: Array<{ label: string; url: string }>;
}

// bump when the competitor facts below are re-verified
export const CHECKED = { iso: "2026-10", label: "October 2026" };

export const competitors: Competitor[] = [
  {
    id: "tableplus",
    sources: [
      { label: "pricing", url: "https://tableplus.com/pricing" },
      { label: "changelog", url: "https://tableplus.com/osx/changelog" },
      { label: "docs", url: "https://docs.tableplus.com" },
      { label: "privacy", url: "https://tableplus.com/privacy" },
    ],
    name: "TablePlus",
    tagline: "Two native database clients compared on features, pricing, and platform support.",
    summary: `Both are native apps. DearSQL is $35 one-time with lifetime updates vs $99 (1yr updates). Free tier with ${FREE_SAVED_CONNECTIONS} connections.`,
    title: "DearSQL vs TablePlus — 2026 Comparison",
    description: `Compare DearSQL and TablePlus on pricing, database support, features, and platforms. DearSQL is $35 one-time with ${FREE_SAVED_CONNECTIONS} free connections; TablePlus costs $99 with limited update coverage.`,
    faq: [
      {
        q: "Is DearSQL cheaper than TablePlus?",
        a: "Yes. DearSQL is $35 as a one-time purchase with all future updates included. TablePlus costs $99 for a perpetual license with 1 year of updates; updates after that need a $59 renewal per device.",
      },
      {
        q: "Does DearSQL support the same databases as TablePlus?",
        a: "Mostly. Both support SQLite, DuckDB, PostgreSQL, MySQL, MariaDB, MongoDB, Redis, MSSQL, Redshift, and Cassandra. TablePlus supports Oracle on macOS only; DearSQL supports it on every platform.",
      },
      {
        q: "Is DearSQL a good TablePlus alternative?",
        a: `Yes. DearSQL is a native desktop SQL client available for macOS, Linux, and Windows — just like TablePlus. Key advantages: $35 vs $99 pricing with lifetime updates, a ${FREE_SAVED_CONNECTIONS}-connection free tier, and Oracle on every platform.`,
      },
    ],
  },
  {
    id: "dbeaver",
    sources: [
      { label: "editions", url: "https://dbeaver.com/edition/" },
      { label: "pricing", url: "https://dbeaver.com/buy/" },
      { label: "Community Edition", url: "https://dbeaver.io/" },
      { label: "usage statistics", url: "https://dbeaver.com/docs/dbeaver/Statistics-Collection/" },
    ],
    name: "DBeaver",
    tagline: "A native C++ app vs a Java-based universal tool.",
    summary: "DearSQL starts instantly with low memory. DBeaver uses 500MB+ RAM with JVM startup. NoSQL is included in DearSQL's free tier; DBeaver requires a paid plan.",
    title: "DearSQL vs DBeaver — 2026 Comparison",
    description: "Compare DearSQL and DBeaver on performance, database support, and pricing. DearSQL is a native C++ app with instant startup; DBeaver is Java/Eclipse-based with 500MB+ memory usage.",
    faq: [
      {
        q: "Is DearSQL faster than DBeaver?",
        a: "Yes. DearSQL is a native C++ app that starts instantly with low memory usage. DBeaver is Java/Eclipse-based with JVM startup overhead and 500MB+ RAM usage during normal operation.",
      },
      {
        q: "Does DearSQL include NoSQL in the free tier unlike DBeaver?",
        a: "Yes. DearSQL includes MongoDB and Redis in the free tier. DBeaver Community Edition does not include NoSQL support — a paid license (Lite or higher) is required.",
      },
      {
        q: "Is DearSQL a good DBeaver alternative?",
        a: "Yes, especially for developers who want native performance, NoSQL support without a paid plan, and a $35 one-time price vs DBeaver's subscription model. DearSQL starts instantly; DBeaver has slow JVM launch times.",
      },
    ],
  },
  {
    id: "datagrip",
    sources: [
      { label: "pricing", url: "https://www.jetbrains.com/datagrip/buy/" },
      { label: "features", url: "https://www.jetbrains.com/datagrip/" },
      { label: "non-commercial license", url: "https://blog.jetbrains.com/datagrip/2025/10/01/datagrip-is-now-free-for-non-commercial-use/" },
      { label: "usage statistics", url: "https://www.jetbrains.com/help/datagrip/settings-usage-statistics.html" },
    ],
    name: "DataGrip",
    tagline: "A lightweight database client vs a full JetBrains IDE.",
    summary: "DearSQL is $35 one-time. DataGrip is a subscription: $109/year for individuals, $259/year for organizations. DearSQL starts instantly; DataGrip is a full IDE with project indexing and 1GB+ RAM usage.",
    title: "DearSQL vs DataGrip — 2026 Comparison",
    description: "Compare DearSQL and DataGrip on pricing, performance, and features. DearSQL costs $35 once; DataGrip is a JetBrains subscription ($109/year individual, $259/year organization) with heavy JVM resource usage.",
    faq: [
      {
        q: "How much does DearSQL cost compared to DataGrip?",
        a: "DearSQL is a $35 one-time purchase. DataGrip is a subscription: $109/year for individuals (cheaper in years 2 and 3) or $259/year per user for organizations. Over 3 years, DearSQL costs $35 vs $261 (individual) or $777 (organization) for DataGrip.",
      },
      {
        q: "Is DearSQL less resource-intensive than DataGrip?",
        a: "Significantly so. DearSQL is a native C++ app with instant startup and low memory usage. DataGrip is built on the JetBrains platform — it uses 1GB+ RAM and has slow startup due to JVM initialization and project indexing.",
      },
      {
        q: "Is DearSQL a good DataGrip alternative?",
        a: "Yes for most use cases. DearSQL covers query editing, schema browsing, inline data editing, and SSH tunneling without the IDE overhead or subscription cost. DataGrip offers more advanced features like code refactoring and VCS integration.",
      },
    ],
  },
  {
    id: "beekeeper",
    sources: [
      { label: "pricing", url: "https://www.beekeeperstudio.io/pricing" },
      { label: "supported databases", url: "https://docs.beekeeperstudio.io/docs/first-page" },
      { label: "security & telemetry", url: "https://docs.beekeeperstudio.io/user_guide/security/" },
    ],
    name: "Beekeeper Studio",
    tagline: "Native C++ app vs Electron.",
    summary: "DearSQL is native C++ with instant startup. Beekeeper Studio is Electron-based with Chromium memory overhead. DearSQL includes MongoDB, Oracle, DuckDB, and Cassandra for free; Beekeeper needs a paid plan for them.",
    title: "DearSQL vs Beekeeper Studio — 2026 Comparison",
    description: "Compare DearSQL and Beekeeper Studio on performance, database support, and pricing. DearSQL is native C++ with instant startup; Beekeeper Studio is Electron-based with Chromium overhead.",
    faq: [
      {
        q: "How does DearSQL compare to Beekeeper Studio on performance?",
        a: "DearSQL is built with native C++ and starts instantly with low memory usage. Beekeeper Studio is built on Electron, which bundles Chromium and Node.js, resulting in high memory usage and slower startup.",
      },
      {
        q: "Does DearSQL support more databases than Beekeeper Studio?",
        a: "In the free tier, yes. DearSQL includes MongoDB, Oracle, DuckDB, and Cassandra for free; Beekeeper Studio Community Edition does not, and they need a paid Beekeeper license. Both include Redis for free.",
      },
      {
        q: "Is DearSQL a good Beekeeper Studio alternative?",
        a: "Yes. DearSQL offers native performance vs Beekeeper's Electron overhead, includes MongoDB and Oracle in the free tier, and costs $35 one-time vs Beekeeper's subscription (from $9/user/month, billed yearly). Both support macOS, Linux, and Windows.",
      },
    ],
  },
  {
    id: "dbgate",
    sources: [
      { label: "editions", url: "https://www.dbgate.io/compare/" },
      { label: "pricing", url: "https://www.dbgate.io/pricing/" },
      { label: "changelog", url: "https://github.com/dbgate/dbgate/blob/master/CHANGELOG.md" },
    ],
    name: "DbGate",
    tagline: "Native C++ app vs an open-source Electron client.",
    summary: "DbGate Community is free, open source and covers NoSQL. DearSQL is native C++ instead of Electron, and its AI assistant comes with a $35 one-time license; DbGate's AI is in Premium at $120/year.",
    title: "DearSQL vs DbGate — 2026 Comparison",
    description: "Compare DearSQL and DbGate on performance, database support, AI and pricing. DearSQL is a native C++ app for $35 once; DbGate is a free Electron client with a $120/year Premium edition.",
    faq: [
      {
        q: "Is DbGate free?",
        a: "Yes. DbGate Community Edition is free and open source (GPL-3.0) with unlimited connections, and it includes MongoDB and Redis. AI features, Redshift and some advanced settings need DbGate Premium, a subscription at $12/month or $120/year.",
      },
      {
        q: "How is DearSQL different from DbGate?",
        a: "DearSQL is a native C++ app rather than Electron, so it starts faster and uses less memory. Its AI assistant (Claude Code, Codex, Gemini CLI, Cursor or your own API key) is included in a $35 one-time license instead of a yearly subscription.",
      },
      {
        q: "Is DearSQL a good DbGate alternative?",
        a: "If you want a lighter native app and AI without a subscription, yes. If you need a fully free open-source tool, a web/server edition, or ER diagrams, DbGate Community is a strong choice.",
      },
    ],
  },
  {
    id: "navicat",
    sources: [
      { label: "Navicat Premium", url: "https://www.navicat.com/en/products/navicat-premium" },
      { label: "Premium Lite", url: "https://www.navicat.com/en/products/navicat-premium-lite" },
      { label: "feature matrix", url: "https://www.navicat.com/en/products/navicat-premium-feature-matrix" },
      { label: "store", url: "https://www.navicat.com/en/store/navicat-premium" },
      { label: "subscription plans", url: "https://www.navicat.com/en/store/navicat-premium-plan" },
    ],
    name: "Navicat",
    tagline: "A lightweight native client vs an enterprise database suite.",
    summary: "Navicat Premium is a full suite (data modeling, sync, BI) from $1,499 perpetual or $749.99/year. DearSQL is a lightweight native client for $35 once, with DuckDB, Cassandra and AI included.",
    title: "DearSQL vs Navicat — 2026 Comparison",
    description: "Compare DearSQL and Navicat Premium on pricing, database support and features. DearSQL is $35 one-time; Navicat Premium costs $1,499 perpetual or $749.99/year, with a free Premium Lite edition.",
    faq: [
      {
        q: "How much does Navicat cost compared to DearSQL?",
        a: "Navicat Premium Standard costs $1,499 for a perpetual license with 1 year of maintenance, or $749.99/year as a subscription. DearSQL is $35 one-time with all future updates. Navicat also offers a free Premium Lite edition without AI or data modeling.",
      },
      {
        q: "Does DearSQL support databases Navicat doesn't?",
        a: "Yes. DearSQL supports DuckDB and Cassandra, which Navicat Premium and Premium Lite do not. Both cover SQLite, PostgreSQL, MySQL, MariaDB, MongoDB, Redis, Oracle, SQL Server and Redshift.",
      },
      {
        q: "Is DearSQL a good Navicat alternative?",
        a: "For querying, browsing and editing data, yes, at a fraction of the price. Navicat goes further with data modeling, data sync, scheduling and BI; if you rely on those, DearSQL does not replace them.",
      },
    ],
  },
];

export const comparisons: Record<string, ComparisonData> = {
  tableplus: {
    architecture: [
      { feature: "architecture", dearsql: "native (C++/ImGui)", competitor: "native", highlight: true },
      { feature: "startup time", dearsql: "instant", competitor: "fast" },
      { feature: "memory usage", dearsql: "low", competitor: "low" },
    ],
    databases: [
      { feature: "SQLite", dearsql: "yes", competitor: "yes" },
      { feature: "DuckDB", dearsql: "yes", competitor: "yes" },
      { feature: "PostgreSQL", dearsql: "yes", competitor: "yes" },
      { feature: "MySQL / MariaDB", dearsql: "yes", competitor: "yes" },
      { feature: "MongoDB", dearsql: "yes", competitor: "yes (beta)" },
      { feature: "Redis", dearsql: "yes", competitor: "yes" },
      { feature: "Oracle", dearsql: "yes", competitor: "macOS only", highlight: true },
      { feature: "MSSQL", dearsql: "yes", competitor: "yes" },
      { feature: "Redshift", dearsql: "yes", competitor: "yes" },
      { feature: "Cassandra", dearsql: "yes", competitor: "yes" },
    ],
    platforms: [
      { feature: "macOS", dearsql: "yes", competitor: "yes" },
      { feature: "Linux", dearsql: "yes", competitor: "yes (fewer databases)" },
      { feature: "Windows", dearsql: "yes", competitor: "yes" },
    ],
    features: [
      { feature: "SSH tunneling", dearsql: "yes", competitor: "yes" },
      { feature: "TLS/SSL", dearsql: "yes", competitor: "yes" },
      { feature: "syntax highlighting", dearsql: "yes", competitor: "yes" },
      { feature: "autocomplete", dearsql: "yes", competitor: "yes" },
      { feature: "inline data editing", dearsql: "yes", competitor: "yes" },
      { feature: "dark mode", dearsql: "yes", competitor: "yes" },
      { feature: "AI assistant", dearsql: "built-in", competitor: "built-in" },
      { feature: "app telemetry", dearsql: "crash reports only", competitor: "opt-out" },
    ],
    pricing: [
      { feature: "free tier", dearsql: `yes (${FREE_SAVED_CONNECTIONS} connections)`, competitor: "trial (2 tabs, 2 windows)", highlight: true },
      { feature: "one-time purchase", dearsql: "$35", competitor: "$99 (1yr updates, $59 renewal)", highlight: true },
      { feature: "subscription required", dearsql: "no", competitor: "no" },
      { feature: "NoSQL in free tier", dearsql: "yes", competitor: "yes (limited)" },
    ],
  },
  dbeaver: {
    architecture: [
      { feature: "architecture", dearsql: "native (C++/ImGui)", competitor: "Java (Eclipse-based)", highlight: true },
      { feature: "startup time", dearsql: "instant", competitor: "slow (JVM startup)", highlight: true },
      { feature: "memory usage", dearsql: "low", competitor: "high (500MB+)", highlight: true },
    ],
    databases: [
      { feature: "SQLite", dearsql: "yes", competitor: "yes" },
      { feature: "DuckDB", dearsql: "yes", competitor: "yes" },
      { feature: "PostgreSQL", dearsql: "yes", competitor: "yes" },
      { feature: "MySQL / MariaDB", dearsql: "yes", competitor: "yes" },
      { feature: "MongoDB", dearsql: "yes", competitor: "yes (paid)" },
      { feature: "Redis", dearsql: "yes", competitor: "yes (paid)" },
      { feature: "Oracle", dearsql: "yes", competitor: "yes" },
      { feature: "MSSQL", dearsql: "yes", competitor: "yes" },
      { feature: "Redshift", dearsql: "yes", competitor: "yes" },
      { feature: "Cassandra", dearsql: "yes", competitor: "yes (paid)" },
    ],
    platforms: [
      { feature: "macOS", dearsql: "yes", competitor: "yes" },
      { feature: "Linux", dearsql: "yes", competitor: "yes" },
      { feature: "Windows", dearsql: "yes", competitor: "yes" },
    ],
    features: [
      { feature: "SSH tunneling", dearsql: "yes", competitor: "yes" },
      { feature: "TLS/SSL", dearsql: "yes", competitor: "yes" },
      { feature: "syntax highlighting", dearsql: "yes", competitor: "yes" },
      { feature: "autocomplete", dearsql: "yes", competitor: "yes" },
      { feature: "inline data editing", dearsql: "yes", competitor: "yes" },
      { feature: "ER diagrams", dearsql: "no", competitor: "yes" },
      { feature: "native UI feel", dearsql: "yes", competitor: "no (Java UI)", highlight: true },
      { feature: "AI assistant", dearsql: "built-in", competitor: "basic (free), advanced (paid)" },
      { feature: "app telemetry", dearsql: "crash reports only", competitor: "optional" },
    ],
    pricing: [
      { feature: "free tier", dearsql: `yes (${FREE_SAVED_CONNECTIONS} connections)`, competitor: "yes (Community Edition)" },
      { feature: "one-time purchase", dearsql: "$35", competitor: "no (subscription)", highlight: true },
      { feature: "NoSQL in free tier", dearsql: "yes", competitor: "no (paid only)", highlight: true },
    ],
  },
  datagrip: {
    architecture: [
      { feature: "architecture", dearsql: "native (C++/ImGui)", competitor: "Java (JetBrains platform)", highlight: true },
      { feature: "startup time", dearsql: "instant", competitor: "slow (JVM + indexing)", highlight: true },
      { feature: "memory usage", dearsql: "low", competitor: "high (1GB+)", highlight: true },
    ],
    databases: [
      { feature: "SQLite", dearsql: "yes", competitor: "yes" },
      { feature: "DuckDB", dearsql: "yes", competitor: "yes" },
      { feature: "PostgreSQL", dearsql: "yes", competitor: "yes" },
      { feature: "MySQL / MariaDB", dearsql: "yes", competitor: "yes" },
      { feature: "MongoDB", dearsql: "yes", competitor: "yes" },
      { feature: "Redis", dearsql: "yes", competitor: "yes" },
      { feature: "Oracle", dearsql: "yes", competitor: "yes" },
      { feature: "MSSQL", dearsql: "yes", competitor: "yes" },
      { feature: "Redshift", dearsql: "yes", competitor: "yes" },
      { feature: "Cassandra", dearsql: "yes", competitor: "yes" },
    ],
    platforms: [
      { feature: "macOS", dearsql: "yes", competitor: "yes" },
      { feature: "Linux", dearsql: "yes", competitor: "yes" },
      { feature: "Windows", dearsql: "yes", competitor: "yes" },
    ],
    features: [
      { feature: "SSH tunneling", dearsql: "yes", competitor: "yes" },
      { feature: "TLS/SSL", dearsql: "yes", competitor: "yes" },
      { feature: "syntax highlighting", dearsql: "yes", competitor: "yes" },
      { feature: "autocomplete", dearsql: "yes", competitor: "yes" },
      { feature: "inline data editing", dearsql: "yes", competitor: "yes" },
      { feature: "refactoring tools", dearsql: "no", competitor: "yes" },
      { feature: "version control", dearsql: "no", competitor: "yes" },
      { feature: "AI assistant", dearsql: "built-in", competitor: "built-in (full quota is paid)" },
      { feature: "learning curve", dearsql: "low", competitor: "moderate", highlight: true },
      { feature: "app telemetry", dearsql: "crash reports only", competitor: "opt-in (required on free license)" },
    ],
    pricing: [
      { feature: "free tier", dearsql: `yes (${FREE_SAVED_CONNECTIONS} connections)`, competitor: "non-commercial only" },
      { feature: "one-time purchase", dearsql: "$35", competitor: "no ($109/yr individual, $259/yr org)", highlight: true },
      { feature: "subscription required", dearsql: "no", competitor: "yes (fallback license after 12 months)", highlight: true },
    ],
  },
  beekeeper: {
    architecture: [
      { feature: "architecture", dearsql: "native (C++/ImGui)", competitor: "Electron (JavaScript)", highlight: true },
      { feature: "startup time", dearsql: "instant", competitor: "slow", highlight: true },
      { feature: "memory usage", dearsql: "low", competitor: "high (Chromium)", highlight: true },
    ],
    databases: [
      { feature: "SQLite", dearsql: "yes", competitor: "yes" },
      { feature: "DuckDB", dearsql: "yes", competitor: "yes (paid)", highlight: true },
      { feature: "PostgreSQL", dearsql: "yes", competitor: "yes" },
      { feature: "MySQL / MariaDB", dearsql: "yes", competitor: "yes" },
      { feature: "MongoDB", dearsql: "yes", competitor: "yes (paid)", highlight: true },
      { feature: "Redis", dearsql: "yes", competitor: "yes" },
      { feature: "Oracle", dearsql: "yes", competitor: "yes (paid)", highlight: true },
      { feature: "MSSQL", dearsql: "yes", competitor: "yes" },
      { feature: "Redshift", dearsql: "yes", competitor: "yes" },
      { feature: "Cassandra", dearsql: "yes", competitor: "yes (paid)", highlight: true },
    ],
    platforms: [
      { feature: "macOS", dearsql: "yes", competitor: "yes" },
      { feature: "Linux", dearsql: "yes", competitor: "yes" },
      { feature: "Windows", dearsql: "yes", competitor: "yes" },
    ],
    features: [
      { feature: "SSH tunneling", dearsql: "yes", competitor: "yes" },
      { feature: "TLS/SSL", dearsql: "yes", competitor: "yes" },
      { feature: "syntax highlighting", dearsql: "yes", competitor: "yes" },
      { feature: "autocomplete", dearsql: "yes", competitor: "yes" },
      { feature: "inline data editing", dearsql: "yes", competitor: "yes" },
      { feature: "AI assistant", dearsql: "built-in", competitor: "paid plans only", highlight: true },
      { feature: "app telemetry", dearsql: "crash reports only", competitor: "opt-in" },
    ],
    pricing: [
      { feature: "free tier", dearsql: `yes (${FREE_SAVED_CONNECTIONS} connections)`, competitor: "yes (Community Edition)" },
      { feature: "one-time purchase", dearsql: "$35", competitor: "no (from $9/user/mo, yearly)", highlight: true },
      { feature: "NoSQL in free tier", dearsql: "yes", competitor: "Redis only", highlight: true },
    ],
  },
  dbgate: {
    architecture: [
      { feature: "architecture", dearsql: "native (C++/ImGui)", competitor: "Electron (Node.js)", highlight: true },
      { feature: "startup time", dearsql: "instant", competitor: "slower (Electron)", highlight: true },
      { feature: "memory usage", dearsql: "low", competitor: "higher (Chromium)", highlight: true },
    ],
    databases: [
      { feature: "SQLite", dearsql: "yes", competitor: "yes" },
      { feature: "DuckDB", dearsql: "yes", competitor: "yes" },
      { feature: "PostgreSQL", dearsql: "yes", competitor: "yes" },
      { feature: "MySQL / MariaDB", dearsql: "yes", competitor: "yes" },
      { feature: "MongoDB", dearsql: "yes", competitor: "yes" },
      { feature: "Redis", dearsql: "yes", competitor: "yes" },
      { feature: "Oracle", dearsql: "yes", competitor: "yes" },
      { feature: "MSSQL", dearsql: "yes", competitor: "yes" },
      { feature: "Redshift", dearsql: "yes", competitor: "yes (paid)", highlight: true },
      { feature: "Cassandra", dearsql: "yes", competitor: "yes" },
    ],
    platforms: [
      { feature: "macOS", dearsql: "yes", competitor: "yes" },
      { feature: "Linux", dearsql: "yes", competitor: "yes" },
      { feature: "Windows", dearsql: "yes", competitor: "yes" },
      { feature: "web / server edition", dearsql: "no", competitor: "yes" },
    ],
    features: [
      { feature: "SSH tunneling", dearsql: "yes", competitor: "yes" },
      { feature: "TLS/SSL", dearsql: "yes", competitor: "yes" },
      { feature: "syntax highlighting", dearsql: "yes", competitor: "yes" },
      { feature: "autocomplete", dearsql: "yes", competitor: "yes" },
      { feature: "inline data editing", dearsql: "yes", competitor: "yes" },
      { feature: "ER diagrams", dearsql: "no", competitor: "yes" },
      { feature: "AI assistant", dearsql: "built-in", competitor: "Premium only", highlight: true },
      { feature: "app telemetry", dearsql: "crash reports only", competitor: "opt-in usage analytics" },
    ],
    pricing: [
      { feature: "free tier", dearsql: `yes (${FREE_SAVED_CONNECTIONS} connections)`, competitor: "yes (open source, unlimited)" },
      { feature: "one-time purchase", dearsql: "$35", competitor: "no ($120/yr Premium)", highlight: true },
      { feature: "NoSQL in free tier", dearsql: "yes", competitor: "yes" },
    ],
  },
  navicat: {
    architecture: [
      { feature: "architecture", dearsql: "native (C++/ImGui)", competitor: "native" },
      { feature: "scope", dearsql: "SQL client", competitor: "full suite (modeling, sync, BI)" },
    ],
    databases: [
      { feature: "SQLite", dearsql: "yes", competitor: "yes" },
      { feature: "DuckDB", dearsql: "yes", competitor: "no", highlight: true },
      { feature: "PostgreSQL", dearsql: "yes", competitor: "yes" },
      { feature: "MySQL / MariaDB", dearsql: "yes", competitor: "yes" },
      { feature: "MongoDB", dearsql: "yes", competitor: "yes" },
      { feature: "Redis", dearsql: "yes", competitor: "yes" },
      { feature: "Oracle", dearsql: "yes", competitor: "yes" },
      { feature: "MSSQL", dearsql: "yes", competitor: "yes" },
      { feature: "Redshift", dearsql: "yes", competitor: "yes" },
      { feature: "Cassandra", dearsql: "yes", competitor: "no", highlight: true },
    ],
    platforms: [
      { feature: "macOS", dearsql: "yes", competitor: "yes" },
      { feature: "Linux", dearsql: "yes", competitor: "yes" },
      { feature: "Windows", dearsql: "yes", competitor: "yes" },
    ],
    features: [
      { feature: "SSH tunneling", dearsql: "yes", competitor: "yes" },
      { feature: "TLS/SSL", dearsql: "yes", competitor: "yes" },
      { feature: "syntax highlighting", dearsql: "yes", competitor: "yes" },
      { feature: "autocomplete", dearsql: "yes", competitor: "yes" },
      { feature: "inline data editing", dearsql: "yes", competitor: "yes" },
      { feature: "ER diagrams", dearsql: "no", competitor: "yes" },
      { feature: "data modeling", dearsql: "no", competitor: "Premium only" },
      { feature: "AI assistant", dearsql: "built-in", competitor: "Premium only (not in Lite)", highlight: true },
    ],
    pricing: [
      { feature: "free tier", dearsql: `yes (${FREE_SAVED_CONNECTIONS} connections)`, competitor: "yes (Premium Lite)" },
      { feature: "one-time purchase", dearsql: "$35", competitor: "$1,499 (1yr maintenance)", highlight: true },
      { feature: "subscription", dearsql: "none", competitor: "$749.99/yr", highlight: true },
      { feature: "NoSQL in free tier", dearsql: "yes", competitor: "yes" },
    ],
  },
};
