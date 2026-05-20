/** Dev / admin: bust in-process loaders so filesystem edits show without restart. */
export function shouldReloadContentFromDisk(): boolean {
  return process.env.NODE_ENV === "development";
}

let siteRawCache: import("@/lib/content/schemas").SiteConfigRaw | null = null;
let skillsRawCache: import("@/lib/content/schemas").SkillsRaw | null = null;
let aboutRawCache: import("@/lib/content/schemas").AboutRaw | null = null;

export function clearContentCache(): void {
  siteRawCache = null;
  skillsRawCache = null;
  aboutRawCache = null;
}

export function getSiteRawCache() {
  return siteRawCache;
}

export function setSiteRawCache(
  value: import("@/lib/content/schemas").SiteConfigRaw | null,
) {
  siteRawCache = value;
}

export function getSkillsRawCache() {
  return skillsRawCache;
}

export function setSkillsRawCache(
  value: import("@/lib/content/schemas").SkillsRaw | null,
) {
  skillsRawCache = value;
}

export function getAboutRawCache() {
  return aboutRawCache;
}

export function setAboutRawCache(value: import("@/lib/content/schemas").AboutRaw | null) {
  aboutRawCache = value;
}
