// ======================================================================
//  UNIVERSAL FIELD RESOLUTION ENGINE (FINAL VERSION - FIXED)
//  - Uses ONLY moduleConfig + finalCaseInputs
//  - Resolves ALL text fields
//  - Supports ANY multi-entry array (no more "*List" keys)
//  - Module-specific list formatting supported
// ======================================================================

export default function dynamicTriggerTemplateConversion(caseData = {}, moduleConfig = {}) {
  const normalized = {};
  const resolved = {};

  // Normalize keys
  for (const key in caseData) {
    normalized[key.toLowerCase().trim()] = caseData[key];
  }

  // Helper: resolve a single field
  const getField = (fieldName) => {
    const norm = fieldName.toLowerCase().trim();
    let value = normalized[norm];

    // Aliases
    const aliases = moduleConfig.fieldAliases?.[fieldName] || [];
    for (const alias of aliases) {
      const a = alias.toLowerCase().trim();
      if (!value && normalized[a]) value = normalized[a];
    }

    // Fuzzy fallback
    if (!value) {
      for (const key in normalized) {
        if (key.includes(norm.replace(/\s+/g, ""))) {
          value = normalized[key];
        }
      }
    }

    return value || "";
  };

  // ============================================================
  // 1. RESOLVE ALL PLACEHOLDERS
  // ============================================================
  const placeholderMap = moduleConfig.templateLogic?.placeholders || {};

  for (const key in placeholderMap) {
    const cleanKey = key.trim();
    resolved[cleanKey] = getField(cleanKey);
  }

  // ============================================================
  // 2. UNIVERSAL LIST HANDLING (NEW SYSTEM)
  // ============================================================

  for (const key in caseData) {
    const value = caseData[key];

    // Only process arrays
    if (!Array.isArray(value)) continue;

    const lower = key.toLowerCase().trim();

    // ⭐ Manual Refund
    if (lower === "manual refund") {
      resolved["Manual Refund"] = value
        .map(entry => `• ${entry.Currency || ""} ${entry.Amount || ""} — PSP: ${entry["PSP Reference Number"] || ""}`)
        .join("\n");
      continue;
    }

    // ⭐ Missing Funds
    if (lower === "missing funds") {
      resolved["Missing Funds"] = value
        .map(entry => `• ${entry.Currency || ""} ${entry.Amount || ""} — PSP: ${entry["PSP Reference Number"] || ""}`)
        .join("\n");
      continue;
    }

    // ⭐ Devices Not on Platform
    if (lower === "devices not on platform") {
      resolved["Devices Not on Platform"] = value
        .map((entry, i) => `${i + 1}. ${entry["Device Type"] || ""} — SN: ${entry["Serial Number"] || ""}`)
        .join("\n");
      continue;
    }

    // ⭐ Default fallback
    resolved[key] = value
      .map(entry => {
        if (typeof entry === "object") {
          return Object.entries(entry)
            .map(([k, v]) => `• ${k}: ${v}`)
            .join("\n");
        }
        return `• ${entry}`;
      })
      .join("\n");
  }

  // ============================================================
  // 3. RETURN CLEAN RESOLVED OBJECT
  // ============================================================
  return resolved;
}
