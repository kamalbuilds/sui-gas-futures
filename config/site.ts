export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Sui Gas Futures",
  description:
    "A platform for hedging gas price volatility on the Sui blockchain by purchasing gas credits at predefined prices for future use.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Trade",
      href: "/trade",
    },
    {
      title: "Portfolio",
      href: "/portfolio",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
  links: {
    twitter: "https://x.com/suigasfutures",
    github: "https://github.com/kamalbuilds/suigasfutures",
    docs: "https://docs.suigasfutures.com",
  },
}
