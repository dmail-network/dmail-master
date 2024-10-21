import { GuidePages, inboxIds } from "@/components/Guide/index";

export const PageList = [
  {
    key: "compose",
    name: "Compose",
    path: "/compose",
    isNav: true,
    isMobileNav: false,
  },
  {
    key: "mail",
    name: "Mail",
    path: "/inbox",
    isNav: false,
    isMobileNav: true,
    isParent: true,
  },
  {
    key: "inbox",
    name: "Inbox",
    path: "/inbox",
    isNav: true,
    isMobileNav: false,
    isMail: true,
  },
  {
    key: "star",
    name: "Starred",
    path: "/starred",
    isNav: true,
    isMobileNav: false,
    isMail: true,
  },
  {
    key: "sent",
    name: "Sent",
    path: "/sent",
    isNav: true,
    isMobileNav: false,
    isMail: true,
  },
  {
    key: "drafts",
    name: "Drafts",
    path: "/drafts",
    isNav: true,
    isMobileNav: false,
    isMail: true,
  },
  {
    key: "spam",
    name: "Spam",
    path: "/spam",
    isNav: true,
    isMobileNav: false,
    isMail: true,
  },
  {
    key: "trash",
    name: "Trash",
    path: "/trash",
    isNav: true,
    isMobileNav: false,
    isMail: true,
    splitLine: true,
  },
  {
    key: "nft",
    name: "NFT Market",
    path: "/market",
    isNav: true,
    isMobileNav: true,
  },
  {
    key: "presale",
    name: "Presale",
    path: "/presale",
    isNav: true,
    isMobileNav: true,
    id: `__guide_${GuidePages.inbox}_${inboxIds[1]}`,
  },
  {
    key: "events",
    name: "Points & Plans",
    path: "/events/points",
    isNav: false,
    isMobileNav: true,
    mobileSplitLine: true,
  },
  {
    key: "assets",
    name: "Assets",
    path: "/assets",
    isNav: true,
    isMobileNav: false,
  },
  // no nav
  {
    key: "workspace",
    name: "Workspace",
    path: "/workspace",
    isNav: false,
    isMobileNav: false,
  },
  // no nav
  {
    key: "dapps",
    name: "DApps center",
    path: "/dapps",
    isNav: false,
    isMobileNav: false,
    mobileSplitLine: true,
  },
  // no nav
  {
    key: "setting",
    name: "Setting",
    path: "/setting/account",
    isNav: false,
    isMobileNav: true,
  },
  {
    key: "contacts",
    name: "Contacts",
    path: "/contacts/dusers",
    isNav: false,
    isMobileNav: true,
  },
  {
    key: "orders",
    name: "Presale",
    path: "/orders",
    isNav: false,
    isMobileNav: false,
  },
  {
    key: "referrals",
    name: "Presale",
    path: "/referrals",
    isNav: false,
    isMobileNav: false,
  },
  {
    key: "contacts",
    name: "Contacts",
    path: "/contacts/dusers",
    isNav: false,
  },
];

export const NavList = PageList.filter(({ isNav }) => isNav)
export const NavMobileList = PageList.filter(({ isMobileNav }) => isMobileNav)
export const MailList = PageList.filter(({ isMail }) => isMail)

export const getParentPath = (path) => {
  const aPath = path.match(/^(\/[^\/]+)/)
  if (aPath.length) {
    return aPath[0]
  }
  return path
}