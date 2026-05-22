// ======================================================
//  logic.Data → dataIndex.js (UPDATED WITH CORRECT DYNAMIC MODULE SUPPORT)
// ======================================================

import Library from '../../data/data.Scripts/library.js';

const Data = {
  raw: null,

  async init() {
    console.log("🔵 [DATAINDEX] Initializing DataIndex…");

    // Load all JSON files through library.js
    await Library.init();

    // ⭐ Core libraries
    const schema = Library.schema();
    const nested = Library.nested();
    const engine = Library.engine();

    // ⭐ Troubleshooting
    const masterTS = Library.masterTS();
    const tsLibrary = Library.tsLibrary();

    // ⭐ NEW — EMAIL SYSTEM
    const emailTemplates = Library.emailTemplates();
    const dynamicEmails = Library.dynamicEmails(); // <-- ARRAY

    console.log("📧 [EMAIL DEBUG] Email Templates Loaded:", {
      count: Object.keys(emailTemplates || {}).length,
      keys: Object.keys(emailTemplates || {})
    });

    console.log("📧 [EMAIL DEBUG] Dynamic Emails Loaded:", {
      count: dynamicEmails?.length || 0,
      ids: dynamicEmails?.map(m => m.dynamicId)
    });

    console.log("📥 [DATAINDEX] Loaded raw libraries:", {
      nestedCategories: nested?.length,
      schemaCount: schema?.length,
      engineCount: engine?.length,
      masterTsCount: masterTS?.length,
      tsLibraryCount: tsLibrary?.length,
      emailTemplateCount: Object.keys(emailTemplates || {}).length,
      dynamicEmailCount: dynamicEmails?.length || 0
    });

    // ======================================================
    // ⭐ BUILD DROPDOWNS + SCHEMAMAP
    // ======================================================
    const { categoryList, subcategoryList, schemaMap } =
      this.buildNestedStructures(nested);

    // ======================================================
    // ⭐ FIXED — BUILD DYNAMIC MODULE REGISTRY
    // ======================================================
    const dynamicModules = {};

    if (Array.isArray(dynamicEmails)) {
      dynamicEmails.forEach(module => {
        if (module.dynamicId) {
          dynamicModules[module.dynamicId] = module;
        }
      });
    }

    console.log("⚡ [DATAINDEX] Registered dynamic modules:", Object.keys(dynamicModules));

    // ======================================================
    // ⭐ STORE EVERYTHING CLEANLY
    // ======================================================
    this.raw = {
      nested,
      categoryList,
      subcategoryList,
      schemaMap,

      // REAL schema
      schema,

      // ENGINE
      engine,

      // Troubleshooting
      masterTS,
      tsLibrary,

      // EMAIL SYSTEM
      emailTemplates,
      dynamicEmails,

      // ⭐ NEW — dynamic modules exposed to index.js
      dynamicModules
    };

    console.log("📦 [DATAINDEX] Built nested structures:", {
      categoryList: categoryList.length,
      subcategoryList: subcategoryList.length,
      schemaMapKeys: Object.keys(schemaMap).length
    });

    console.log("✅ [DATAINDEX] DataIndex initialization complete.");
  },

  buildNestedStructures(nestedArray) {
    const categoryList = [];
    const subcategoryList = [];
    const schemaMap = {};

    nestedArray.forEach(categoryObj => {
      const categoryKey = Object.keys(categoryObj)[0];
      const category = categoryObj[categoryKey];

      categoryList.push({
        id: category.id,
        label: category.label
      });

      if (category.subcategories) {
        Object.values(category.subcategories).forEach(sub => {
          const entry = {
            category: category.label,
            subcategory: sub.subcategory,
            schemaId: sub.schemaId,
            emailId: sub.emailId,

            // ⭐ tsId stays ONLY here — for troubleshooting
            tsId: sub.tsId,

            // ⭐ NEW — dynamicId support
            dynamicId: sub.dynamicId
          };

          subcategoryList.push(entry);
          schemaMap[sub.schemaId] = entry;
        });
      }
    });

    return { categoryList, subcategoryList, schemaMap };
  },

  // Accessors
  categories() { return this.raw?.categoryList || []; },
  subcategories() { return this.raw?.subcategoryList || []; },
  schemaMap() { return this.raw?.schemaMap || {}; },

  // REAL schema
  schema() { return this.raw?.schema || []; },

  // ENGINE
  engine() { return this.raw?.engine || []; },

  // Troubleshooting
  masterTS() { return this.raw?.masterTS || []; },
  tsLibrary() { return this.raw?.tsLibrary || []; },

  // EMAIL SYSTEM
  emailTemplates() { return this.raw?.emailTemplates || {}; },
  dynamicEmails() { return this.raw?.dynamicEmails || {}; },

  // ⭐ NEW — dynamic modules
  dynamicModules() { return this.raw?.dynamicModules || {}; }
};

export async function loadAllData() {
  await Data.init();
  return Data.raw;
}

export function getSchemaMap() { return Data.schemaMap(); }
export function getMasterTSLibrary() { return Data.masterTS(); }
export function getTSLibrary() { return Data.tsLibrary(); }

// ⭐ NEW EXPORTS
export function getEmailTemplates() { return Data.emailTemplates(); }
export function getDynamicEmails() { return Data.dynamicEmails(); }
export function getDynamicModules() { return Data.dynamicModules(); }

export default Data;