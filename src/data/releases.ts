export const GITHUB_RELEASE_BASE =
  "https://github.com/dunkbing/dearsql/releases/download";

export interface SparkleInfo {
  edSignature: string;
  length: number;
}

export interface Release {
  version: string;
  date: string; // ISO date (YYYY-MM-DD)
  changes: string[];
  sparkle?: SparkleInfo & {
    minimumSystemVersion?: string; // defaults to "14.0"
  };
  windows?: SparkleInfo;
}

export const releases: Release[] = [
  {
    version: "0.4.2",
    date: "2026-04-12",
    changes: [
      "Add auto-increment support to table editor.",
      "Optimize GTK cursor updates on Linux.",
      "Add date/time picker for table cell editing.",
      "Fix menu popover styles.",
    ],
    sparkle: {
      edSignature:
        "mGvMX0JrTDqAi+hOOq+VhdoWwF048RSz8n1GMwNCoBa337vg9k9UkPQtvpeI1bXuOaLGUluwN696QaetEHLdCg==",
      length: 10534275,
    },
    windows: {
      edSignature:
        "hF6rhXnSl1hW4zU8hCpPRxMrRXGF8TmUCgrW0Q8csz0CnCg0W15as63Q01t4pPepum/NYqriYycZ63fzzXvMCg==",
      length: 7999488,
    },
  },
  {
    version: "0.4.1",
    date: "2026-04-08",
    changes: [
      "Render boolean cells as checkboxes instead of t/f strings.",
      "Show 1 line for table cell only.",
      "Fix auto-complete input: anchor popup to input, not end-icon button.",
      "Fix text editor: correct line numbers and click hit-test when scrolled.",
      "Fix text editor: jump to line edge on up/down at first/last line.",
    ],
    sparkle: {
      edSignature:
        "9BzhftAbIDwOk9IsXO85Rm9Wd5nVbrYkd5NyqHYFisrkAo3AQ2F3jqY5BNhkymc5YHdWvkLsbI32WKugz4exAg==",
      length: 10515734,
    },
    windows: {
      edSignature:
        "aToEY09ORdbqEoO+qE5xRZGNigMBFIUGQQu/LPx3sWRnmyHt4WTEW1qFAfSU4u/qJsj5TdnFVPhTRFcxWw3CCQ==",
      length: 7811072,
    },
  },
  {
    version: "0.4.0",
    date: "2026-04-07",
    changes: [
      "Fix filter auto-complete.",
      "Fix Japanese/Chinese fonts.",
      "Display routines/functions node.",
      "Add routine viewer tab.",
      "Show/hide db from the list.",
      "Improve save dialog: SQL editor, editable SQL, cmd+s shortcut.",
    ],
    sparkle: {
      edSignature:
        "4tLbUmzziB6Mm+Rq6ktJyXfTclMitLdMTODAElTJ4I3zcwQP4VwoQOLCO908u7T4UHQ3mflVi+VqFzFe+t7kAQ==",
      length: 10504016,
    },
    windows: {
      edSignature:
        "AwwpLUCRFDUlPoQw1pruEEBPe9jjKLpGzSuoMX/vv0DauYAVsLY3lYQMlZxPuPCqTElZNmyH5ryV1JxcOHkOBw==",
      length: 7802880,
    },
  },
  {
    version: "0.3.7",
    date: "2026-04-03",
    changes: [
      "Make tables selectable.",
      "Update app colorscheme.",
      "Bug fixes.",
    ],
    sparkle: {
      edSignature:
        "MMMENJaEdAxe/v80rST2R8BJQV9w7NS/Yj28qxetA6/YYubn6VQBMhplXpWMRadlbwWRBQj6EKdMiqHBZJgSAQ==",
      length: 10004011,
    },
    windows: {
      edSignature:
        "UEwHcACQrc5mKSYKAVLYAS15bb45rMqkIm2zljYlvI5Pz5OZEFGtXGDer6nIa/QasyE+9PJqPnBc12ynAgZ1DQ==",
      length: 7385088,
    },
  },
  {
    version: "0.3.6",
    date: "2026-03-31",
    changes: ["Bug fixes."],
    sparkle: {
      edSignature:
        "SRieqOdy4VUO0guyiv7UGb4xus+hRnhcfYV+FYadMzf3pNqUhtGGDtkdqpaIoOlFM0wdAxXa4/Arvz76BwlCAA==",
      length: 9989952,
    },
    windows: {
      edSignature:
        "nWHpQz6VOrrcbuCb4V/S00G/QGed3SMyNWXM+9Urbus6wvu5bFRUK+pR7Xdy26WJZ8VrWzq0Pri8/PloneCcBw==",
      length: 7376896,
    },
  },
  {
    version: "0.3.5",
    date: "2026-03-25",
    changes: ["Bug fixes."],
    sparkle: {
      edSignature:
        "WCP9E0Bc+A1N6RKMJFwjeiRDa5oPmddGsdlwp9MnHFCMNCsaN87Oxo5fMjkWkx0tARvBn8d8tDugrfnFLcKVAA==",
      length: 9973571,
    },
    windows: {
      edSignature:
        "0eMZpXb2GDAT0uzvSmVb15oTIS0cYG8ZppO/0R0xyu88hR+2O2oVgAnvAU34wqVxxy0nbbS6VKJi5pm99LS4Dw==",
      length: 7360512,
    },
  },
  {
    version: "0.3.3",
    date: "2026-03-22",
    changes: ["Fixed saving scripts."],
    sparkle: {
      edSignature:
        "ZxWRWSDbFpsPx1iFlU1DzwE3lm7zoPz/wTCjXX2MavCnuOfpLB3iOKk0h6UdJd1hLGcP8HyU1mKs0uQsyQqxDQ==",
      length: 9850386,
    },
    windows: {
      edSignature:
        "5FAmCdzOFA4HLE5AU9SO+KTdZ1jDZNVkzWMhAFWXK2wsIKFJP/9E3xr8uGIsIXFHZB80gr7pLOyFZA7qKMtqCw==",
      length: 7303168,
    },
  },
  {
    version: "0.3.2",
    date: "2026-03-21",
    changes: [
      "Added SQL query save.",
      "Fixed app unresponsive after idle mode on macOS and Windows.",
    ],
    sparkle: {
      edSignature:
        "iNNRmhpNQ9y0p8i4hCfl43/Vq97Dy+pvUjYdd5bPHTRN2PYBZdNE4boB09A6VwaNTak+mbtCH+4aXfrsJiNOCw==",
      length: 9850495,
    },
    windows: {
      edSignature:
        "qkeL5fuMPRqNzA+AavoIXtllL+col9SngJKtM5PDBDrI6iNC6t+t22ax/uLHiPM5zOZxv3Wg5aGE2PuCkZNYDA==",
      length: 7303168,
    },
  },
  {
    version: "0.3.1",
    date: "2026-03-19",
    changes: [
      "Added data importer.",
      "Replaced table edit dialog with inline tab.",
      "Added Windows support.",
      "Improved Linux idle mode when inactive and unfocused.",
    ],
    sparkle: {
      edSignature:
        "Js3lyrKY6h11NsfenuHYavqgteU/cqW8dZnz+UlrkeTt0gSUexPKV5hHl97sUrOQGuMrC+gp7twapxVtFqsfBQ==",
      length: 9838209,
    },
    windows: {
      edSignature:
        "tqQS5CJboRxP4R2YAv5XH1tPAkeoXMGGPccA+VKi47358oP57pfF92oXkO9MGgnfz1pm725xXIzgSSp6f8OfAw==",
      length: 7294976,
    },
  },
  {
    version: "0.3.0",
    date: "2026-03-15",
    changes: [
      "Added CSV editor.",
      "Added file open support and close tabs on connection removal.",
      "Switched to libmariadb.",
      "Fixed connection pool reconnect handling.",
    ],
    sparkle: {
      edSignature:
        "fImgqEM2c8M6nWmjXCpxmOspw3eH+szIo2GNeG70XBE+m+lwUVPvEe0GKDZoz1x3wBWhu7VaoEJxnQ0P1E45Dw==",
      length: 9802568,
    },
  },
  {
    version: "0.2.3",
    date: "2026-03-13",
    changes: [
      "Added Oracle database support.",
      "Added table export to JSON and CSV.",
      "Added editor font size setting.",
      "Added Oracle client install status and improved macOS client install flow.",
      "Fixed Linux build issues and other stability improvements.",
    ],
    sparkle: {
      edSignature:
        "Hb0zpz6CN1yPvJrveUzeb43iOSsHEtg73ILtPcJntWS963lRYnN9YdugYvMHODwu82YAzR3+zkkDIDk96xc9Bg==",
      length: 11774071,
    },
  },
  {
    version: "0.2.2",
    date: "2026-03-10",
    changes: [
      "Added Redshift support.",
      "Added MongoDB query editor and AI assistant.",
      "Added connection rename option with native input dialog.",
      "Added MSSQL database selector in SQL editor.",
      "Added system database visibility option.",
      "Fixed PostgreSQL deferred schema loading.",
    ],
    sparkle: {
      edSignature:
        "OExRLjM9cCWiNa26CS8Ul6au4T9hfEu1AST3q+YvXdKVMZ5xSupqUSx62XSypWxa62lyb3z7EL20l4qUA1wdCw==",
      length: 11474389,
    },
  },
  {
    version: "0.2.1",
    date: "2026-03-08",
    changes: [
      "Added Redis commands runner and pub/sub.",
      "Added MSSQL support.",
      "Bug fixes and improvements.",
    ],
    sparkle: {
      edSignature:
        "ZLSghE/Ajl7uo1YPR1eGwJ/XEh630qkdcC6aSnI2TRPGAMwC8Jplx4eoep0Bv4R9XLQ3cVdA3uW5yCBLQvH2CA==",
      length: 11404707,
    },
  },
  {
    version: "0.2.0",
    date: "2026-03-02",
    changes: [
      "Added native alert dialog.",
      "Fixed MySQL crash.",
      "Fixed tab flash and improved light theme contrast.",
      "Disabled form fields while connecting.",
    ],
    sparkle: {
      edSignature:
        "M92iGtb0rFuhN6m8/VaEYtVQ088yRr75QKO/zpj+4FrqzX5rn1QN4+KCZzC4DBQZwY9OJI1vg4Jl44PcurJtCg==",
      length: 10971438,
    },
  },
  {
    version: "0.1.12",
    date: "2026-02-27",
    changes: [
      "Added one-click SQL formatting.",
      "Added shortcuts: Ctrl+Enter run, Ctrl+/ comment, Ctrl+F/Ctrl+H find and replace.",
      "Improved autocomplete with type indicators.",
      "Synced editor colors with app theme.",
      "Fixed AI chat input affecting the SQL editor.",
    ],
    sparkle: {
      edSignature:
        "zRy8rUrkw+jchbh2iTuM7BukuFDHcxcKA8u3CNl8OW3/V+GmQuxx3OFX81/34e2iz2hdge/gAAWUGA2BfDkfBQ==",
      length: 10972813,
    },
  },
  {
    version: "0.1.11",
    date: "2026-02-27",
    changes: [
      "Replaced the old input with a custom SQL editor.",
      "Added tree-sitter SQL syntax highlighting.",
      "Added autocomplete for SQL keywords and database objects.",
      "Added line numbers, cursor and selection improvements, keyboard and mouse navigation.",
      "Added undo/redo and full clipboard support.",
    ],
  },
  {
    version: "0.1.9",
    date: "2026-02-22",
    changes: [
      "Added AI chat panel.",
      "Added database/schema selection dropdowns to SQL editor tab.",
      "Fixed refresh crash.",
    ],
    sparkle: {
      edSignature:
        "FQwijLCE1b6koqfwKqZiViMR8biepXvmIFf//28krSzDpZqbeDjVo3espPbTms9OIOkLZmP989DdQWOxAhUuDg==",
      length: 10020499,
    },
  },
];

export function dmgUrl(version: string): string {
  return `${GITHUB_RELEASE_BASE}/v${version}/DearSQL.dmg`;
}

export function msiUrl(version: string): string {
  return `${GITHUB_RELEASE_BASE}/v${version}/DearSQL-x64.msi`;
}

export function appImageUrl(version: string): string {
  return `${GITHUB_RELEASE_BASE}/v${version}/DearSQL-x86_64.AppImage`;
}

// format ISO date to RFC 822 for Sparkle
export function toRfc822(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${days[d.getUTCDay()]}, ${String(d.getUTCDate()).padStart(2, "0")} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()} 00:00:00 +0000`;
}
