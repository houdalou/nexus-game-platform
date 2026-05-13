// Application Branding Configuration
// Admin can update these values to rename/rebrand the application

export const BRANDING = {
  appName: "NEXUS",
  appTagline: "COMPETITIVE GAMING PLATFORM",
  logoText: "NEXUS",
  logoAccent: "US",
  primaryColor: "#d4a84b", // Gold
  secondaryColor: "#7eb8d4", // Cyan
  dangerColor: "#dc505a", // Red
  fontFamilyDisplay: "Orbitron, monospace",
  fontFamilyBody: "Rajdhani, sans-serif",
  fontFamilyMono: "Share Tech Mono, monospace",
};

// Default values that can be overridden by admin settings
export const DEFAULT_BRANDING = { ...BRANDING };

// Load branding from localStorage if admin has customized it
export const getBranding = () => {
  try {
    const saved = localStorage.getItem("branding_config");
    if (saved) {
      return { ...DEFAULT_BRANDING, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to load branding config", e);
  }
  return DEFAULT_BRANDING;
};

// Save branding configuration (admin only)
export const saveBranding = (config) => {
  try {
    localStorage.setItem("branding_config", JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Failed to save branding config", e);
    return false;
  }
};

// Reset to default branding
export const resetBranding = () => {
  try {
    localStorage.removeItem("branding_config");
    return true;
  } catch (e) {
    console.error("Failed to reset branding config", e);
    return false;
  }
};
