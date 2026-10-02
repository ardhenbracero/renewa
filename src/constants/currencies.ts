export type Currency = {
  code: string;
  symbol: string;
  flag: string;
  label: string;
};

export const CURRENCIES: Currency[] = [
  { code: "PHP", symbol: "₱", flag: "🇵🇭", label: "Philippine Peso" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", label: "Euro" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", label: "British Pound" },
  { code: "USD", symbol: "$", flag: "🇺🇸", label: "US Dollar" },
  { code: "JPY", symbol: "¥", flag: "🇯🇵", label: "Japanese Yen" },
  { code: "CAD", symbol: "$", flag: "🇨🇦", label: "Canadian Dollar" },
  { code: "AUD", symbol: "$", flag: "🇦🇺", label: "Australian Dollar" },
  { code: "INR", symbol: "₹", flag: "🇮🇳", label: "Indian Rupee" },
];
