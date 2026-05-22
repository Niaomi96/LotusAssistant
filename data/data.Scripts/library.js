// ======================================================
//  FETCH-BASED LIBRARY LOADER (FINAL — CLEAN + FILTERED)
// ======================================================

async function safeFetch(path, label) {
  try {
    const res = await fetch(path);

    if (!res.ok) {
      console.error(`❌ Failed to fetch ${label}:`, res.status, path);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ Error loading ${label}:`, err, path);
    return null;
  }
}

// ======================================================
//  NORMALIZE EMAIL TEMPLATES → DICTIONARY BY emailId
// ======================================================
function normalizeEmailTemplates(raw) {
  if (!raw) return {};

  // If already dictionary format → return as-is
  if (!raw.templates) return raw;

  const dict = {};
  raw.templates.forEach(t => {
    if (t.emailId) {
      dict[t.emailId] = t;
    }
  });

  return dict;
}

// ======================================================
//  NORMALIZE DYNAMIC EMAILS (same logic)
// ======================================================
function normalizeDynamicEmails(raw) {
  if (!raw) return {};

  if (!raw.templates) return raw;

  const dict = {};
  raw.templates.forEach(t => {
    if (t.emailId) {
      dict[t.emailId] = t;
    }
  });

  return dict;
}

// ======================================================
//  MAIN LOADER
// ======================================================

async function loadLibrary() {
  const [
    directoryNested,
    schemaLibrary,
    schemaEngine,
    masterTS,
    tsLibrary,
    emailTemplatesRaw,
    dynamicEmailsRaw
  ] = await Promise.all([
    safeFetch('../../data/data.Library/library.Master/MasterDirectoryDN.json', 'MasterDirectoryDN.json'),
    safeFetch('../../data/data.Library/library.schema/schemalibrary.json', 'schemalibrary.json'),
    safeFetch('../../data/data.Engine/schemaengines.json', 'schemaengines.json'),
    safeFetch('../../data/data.Library/library.Master/masterTSlibrary.json', 'masterTSlibrary.json'),
    safeFetch('../../data/data.Library/library.Troubleshooting/TSlibrary.json', 'TSlibrary.json'),

    // ⭐ EMAIL SYSTEM
    safeFetch('../../data/data.Library/library.Email/emailTemplates.json', 'emailTemplates.json'),
    safeFetch('../../data/data.Library/library.Email/dynamicEmails.json', 'dynamicEmails.json')
  ]);

  // Normalize email systems
  const emailTemplates = normalizeEmailTemplates(emailTemplatesRaw);
  const dynamicEmails = normalizeDynamicEmails(dynamicEmailsRaw);

  console.log("📚 [LIBRARY] Loaded:", {
    nested: directoryNested?.length,
    schema: schemaLibrary?.length,
    engine: schemaEngine?.length,
    masterTS: masterTS?.length,
    tsLibrary: tsLibrary?.length,
    emailTemplates: Object.keys(emailTemplates).length,
    dynamicEmails: Object.keys(dynamicEmails).length
  });

  // ⭐ FILTER FUNCTION — removes empty objects + invalid entries
  const filterValid = (item) =>
    item &&
    typeof item === "object" &&
    Object.keys(item).length > 0 &&
    item.id;

  return {
    directoryNested: Array.isArray(directoryNested)
      ? directoryNested
      : Object.values(directoryNested || {}),

    schemaLibrary: Array.isArray(schemaLibrary)
      ? schemaLibrary.filter(filterValid)
      : Object.values(schemaLibrary || {}).filter(filterValid),

    schemaEngine: Array.isArray(schemaEngine)
      ? schemaEngine.filter(filterValid)
      : Object.values(schemaEngine || {}).filter(filterValid),

    masterTS: Array.isArray(masterTS)
      ? masterTS
      : Object.values(masterTS || {}),

    tsLibrary: Array.isArray(tsLibrary)
      ? tsLibrary
      : Object.values(tsLibrary || {}),

    // ⭐ EMAIL SYSTEM (NOW NORMALIZED)
    emailTemplates,
    dynamicEmails
  };
}

// ======================================================
//  PUBLIC API
// ======================================================

const Library = {
  raw: null,

  async init() {
    this.raw = await loadLibrary();
  },

  nested() { return this.raw.directoryNested || []; },
  schema() { return this.raw.schemaLibrary || []; },
  engine() { return this.raw.schemaEngine || []; },
  masterTS() { return this.raw.masterTS || []; },
  tsLibrary() { return this.raw.tsLibrary || []; },

  // ⭐ EMAIL GETTERS
  emailTemplates() { return this.raw.emailTemplates || {}; },
  dynamicEmails() { return this.raw.dynamicEmails || {}; }
};

export default Library;

export function getMasterTSLibrary() { return Library.masterTS(); }
export function getTSLibrary() { return Library.tsLibrary(); }

// ⭐ NEW EXPORTS
export function getEmailTemplates() { return Library.emailTemplates(); }
export function getDynamicEmails() { return Library.dynamicEmails(); }