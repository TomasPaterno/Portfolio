export const siteConfig = {
  name: "Your Name",
  title: "Embedded Systems Engineer",
  description:
    "Firmware, robotics, and electronics engineering portfolio — precision-built systems from bare metal to flight-ready software.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: "Your Name",
  email: "hello@example.com",
  locale: "en_US",
  keywords: [
    "embedded systems",
    "firmware",
    "robotics",
    "electronics",
    "RTOS",
    "FPGA",
    "aerospace",
  ],
  nav: [
    { title: "Home", href: "/" },
    { title: "Projects", href: "/projects" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
} as const;
