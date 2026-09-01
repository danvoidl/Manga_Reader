// Maps a MangaDex translated-language code to an emoji flag for the UI.
const FLAGS: Record<string, string> = {
  "pt-br": "🇧🇷",
  pt: "🇵🇹",
  en: "🇬🇧",
  es: "🇪🇸",
  "es-la": "🇲🇽",
  fr: "🇫🇷",
  it: "🇮🇹",
  de: "🇩🇪",
  ca: "🇪🇸",
  nl: "🇳🇱",
  pl: "🇵🇱",
  ru: "🇷🇺",
  ja: "🇯🇵",
  ko: "🇰🇷",
  zh: "🇨🇳",
  "zh-hk": "🇭🇰",
  id: "🇮🇩",
  vi: "🇻🇳",
  th: "🇹🇭",
  tr: "🇹🇷",
};

export function langFlag(code?: string): string {
  if (!code) return "🏳️";
  return FLAGS[code.toLowerCase()] ?? "🏳️";
}
