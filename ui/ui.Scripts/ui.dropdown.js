// ======================================================
//  ui.dropdown.js (FINAL — NESTED MASTER DIRECTORY)
//  + Slide Panel Support (NON-DESTRUCTIVE)
//  + MIRROR HEADER UPDATE (currentMain + currentSub)
// ======================================================

export const DropdownUI = {

    categories: [],
    subcategories: [],

    mainList: null,
    mainDisplayText: null,
    subWrapper: null,
    subList: null,
    subDisplayText: null,
    onSelect: null,

    // ⭐ NEW: slide panel reference
    categoryPanel: null,

    init({ categories, subcategories, mainList, mainDisplayText, subWrapper, subList, subDisplayText, onSelect }) {

        // ⭐ Store nested lists
        this.categories = categories || [];
        this.subcategories = subcategories || [];

        this.mainList = mainList;
        this.mainDisplayText = mainDisplayText;
        this.subWrapper = subWrapper;
        this.subList = subList;
        this.subDisplayText = subDisplayText;
        this.onSelect = onSelect;

        // ⭐ NEW: slide panel wrapper
        this.categoryPanel = document.getElementById("categoryPanel");

        // ⭐ NEW: TAB trigger (bubble that slides with panel)
        const panelTab = document.getElementById("categoryTab");
        if (panelTab) {
            panelTab.addEventListener("click", (e) => {
                e.stopPropagation();
                this.togglePanel();
            });
        }

        // ⭐ Existing dropdown toggles stay EXACTLY the same
        this.mainDisplayText.addEventListener("click", () => this.toggleMain());
        this.subDisplayText.addEventListener("click", () => this.toggleSub());

        // ⭐ Hamburger inside panel still toggles MAIN dropdown
        const hamburger = document.getElementById("hamburgerIcon");
        if (hamburger) {
            hamburger.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleMain();
            });
        }

        // ⭐ Click outside closes panel
        document.addEventListener("click", (e) => {
            if (!e.target.closest("#categoryPanel") && !e.target.closest("#categoryTab")) {
                this.closePanel();
            }
        });

        this.populateCategories();
    },

    // ==================================================
    //  SLIDE PANEL CONTROLS
    // ==================================================
    togglePanel() {
        if (!this.categoryPanel) return;

        const isOpen = this.categoryPanel.classList.contains("open");
        isOpen ? this.closePanel() : this.openPanel();
    },

    openPanel() {
        if (!this.categoryPanel) return;

        this.categoryPanel.classList.add("open");

        // ⭐ Move the tab forward with the panel
        const panelTab = document.getElementById("categoryTab");
        if (panelTab) {
            panelTab.style.left = "400px"; // same width as panel
        }
    },

    closePanel() {
        if (!this.categoryPanel) return;

        this.categoryPanel.classList.remove("open");

        // ⭐ Move the tab back to the edge
        const panelTab = document.getElementById("categoryTab");
        if (panelTab) {
            panelTab.style.left = "0px";
        }
    },

    // ==================================================
    //  Populate main categories (UPDATED WITH MIRROR)
    // ==================================================
    populateCategories() {
        if (!this.categories.length || !this.mainList) return;

        const sorted = [...this.categories].sort((a, b) =>
            a.label.localeCompare(b.label)
        );

        this.mainList.innerHTML = "";

        sorted.forEach(cat => {
            const item = document.createElement("div");
            item.className = "dropdownItem";
            item.textContent = cat.label;

            item.addEventListener("click", () => {
                this.mainDisplayText.textContent = cat.label;

                // ⭐ MIRROR TO HEADER
                document.getElementById("currentMain").textContent = cat.label;
                document.getElementById("currentSub").textContent = "";

                this.populateSubcategories(cat.label);

                this.subDisplayText.textContent = "Select Subcategory";

                this.closeSub();
                this.subWrapper.style.display = "block";
                this.closeMain();
            });

            this.mainList.appendChild(item);
        });
    },

    // ==================================================
    //  Populate subcategories (UPDATED WITH MIRROR)
    // ==================================================
    populateSubcategories(categoryLabel) {

        this.subList.innerHTML = "";

        const subs = this.subcategories
            .filter(x => x.category === categoryLabel)
            .sort((a, b) => a.subcategory.localeCompare(b.subcategory));

        subs.forEach(entry => {
            const item = document.createElement("div");
            item.className = "dropdownItem";
            item.textContent = entry.subcategory;

            item.addEventListener("click", () => {
                this.subDisplayText.textContent = entry.subcategory;
                this.closeSub();

                // ⭐ MIRROR TO HEADER
                document.getElementById("currentSub").textContent = entry.subcategory;


                this.onSelect({
                    schemaId: entry.schemaId,
                    tsId: entry.tsId,
                    emailId: entry.emailId
                });

                // ⭐ Optional: close panel after choosing subcategory
                this.closePanel();
            });

            this.subList.appendChild(item);
        });
    },

    // ==================================================
    //  UI Helpers (UNCHANGED)
    // ==================================================
    toggleMain() {
        const isOpen = this.mainList.style.display === "block";
        this.closeSub();
        this.mainList.style.display = isOpen ? "none" : "block";
    },

    toggleSub() {
        const isOpen = this.subList.style.display === "block";
        this.subList.style.display = isOpen ? "none" : "block";
    },

    closeMain() {
        this.mainList.style.display = "none";
    },

    closeSub() {
        this.subList.style.display = "none";
    }
};
