

/* ======================================================
   ui.dropdown.js
   Lotus Assistant — Nested Category Directory
   + Sidebar Panel Toggle
   + Main Category Dropdown
   + Subcategory Dropdown
   + Current Header Synchronization
   ====================================================== */

export const DropdownUI = {
    categories: [],
    subcategories: [],

    mainWrapper: null,
    mainList: null,
    mainDisplayText: null,
    mainLabel: null,

    subWrapper: null,
    subList: null,
    subDisplayText: null,
    subLabel: null,

    onSelect: null,
    categoryPanel: null,
    initialized: false,

    // ==================================================
    // INITIALIZATION
    // ==================================================
    init({
        categories = [],
        subcategories = [],
        mainWrapper = null,
        mainList,
        mainDisplayText,
        subWrapper,
        subList,
        subDisplayText,
        onSelect
    }) {
        // Prevent accidental duplicate event listeners.
        if (this.initialized) {
            this.destroy();
        }

        this.categories = Array.isArray(categories) ? categories : [];
        this.subcategories = Array.isArray(subcategories)
            ? subcategories
            : [];

        this.mainWrapper =
            mainWrapper || document.getElementById("mainWrapper");

        this.mainList =
            mainList || document.getElementById("mainList");

        this.mainDisplayText =
            mainDisplayText || document.getElementById("mainDisplayText");

        this.mainLabel = document.getElementById("mainLabel");

        this.subWrapper =
            subWrapper || document.getElementById("subWrapper");

        this.subList =
            subList || document.getElementById("subList");

        this.subDisplayText =
            subDisplayText || document.getElementById("subDisplayText");

        this.subLabel = document.getElementById("subLabel");

        this.onSelect = onSelect;
        this.categoryPanel = document.getElementById("categoryPanel");

        if (
            !this.mainWrapper ||
            !this.mainList ||
            !this.mainDisplayText ||
            !this.subWrapper ||
            !this.subList ||
            !this.subDisplayText ||
            !this.categoryPanel
        ) {
            console.error(
                "DropdownUI: Required dropdown HTML elements are missing."
            );
            return;
        }

        // Sidebar tab opens and closes the category panel.
        this.handleTabClick = (event) => {
            event.stopPropagation();
            this.togglePanel();
        };

        this.categoryTab = document.getElementById("categoryTab");

        this.categoryTab?.addEventListener(
            "click",
            this.handleTabClick
        );

        // Main category display.
        this.handleMainClick = (event) => {
            event.stopPropagation();
            this.toggleMain();
        };

        this.mainDisplayText.addEventListener(
            "click",
            this.handleMainClick
        );

        // Subcategory display.
        this.handleSubClick = (event) => {
            event.stopPropagation();
            this.toggleSub();
        };

        this.subDisplayText.addEventListener(
            "click",
            this.handleSubClick
        );

        // Close the panel when clicking outside it.
        this.handleDocumentClick = (event) => {
            if (
                !event.target.closest("#categoryPanel") &&
                !event.target.closest("#categoryTab")
            ) {
                this.closePanel();
            }
        };

        document.addEventListener(
            "click",
            this.handleDocumentClick
        );

        // Keyboard support for the dropdown displays.
        this.handleMainKeydown = (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this.toggleMain();
            } else if (event.key === "Escape") {
                this.closeMain();
            }
        };

        this.handleSubKeydown = (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this.toggleSub();
            } else if (event.key === "Escape") {
                this.closeSub();
            }
        };

        this.mainDisplayText.addEventListener(
            "keydown",
            this.handleMainKeydown
        );

        this.subDisplayText.addEventListener(
            "keydown",
            this.handleSubKeydown
        );

        this.initialized = true;

        // Start with both dropdowns closed.
        this.closeMain();
        this.closeSub();

        this.populateCategories();
    },

    // ==================================================
    // REMOVE THIS INSTANCE'S EVENT LISTENERS
    // ==================================================
    destroy() {
        this.categoryTab?.removeEventListener(
            "click",
            this.handleTabClick
        );

        this.mainDisplayText?.removeEventListener(
            "click",
            this.handleMainClick
        );

        this.subDisplayText?.removeEventListener(
            "click",
            this.handleSubClick
        );

        document.removeEventListener(
            "click",
            this.handleDocumentClick
        );

        this.mainDisplayText?.removeEventListener(
            "keydown",
            this.handleMainKeydown
        );

        this.subDisplayText?.removeEventListener(
            "keydown",
            this.handleSubKeydown
        );

        this.initialized = false;
    },

    // ==================================================
    // SIDEBAR PANEL
    // ==================================================
    togglePanel() {
        if (!this.categoryPanel) return;

        if (this.categoryPanel.classList.contains("open")) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    },

    openPanel() {
        if (!this.categoryPanel) return;

        this.categoryPanel.classList.add("open");

        if (this.categoryTab) {
            this.categoryTab.style.left = "400px";
        }
    },

    closePanel() {
        if (!this.categoryPanel) return;

        this.categoryPanel.classList.remove("open");

        if (this.categoryTab) {
            this.categoryTab.style.left = "0px";
        }

        this.closeMain();
        this.closeSub();
    },

    // ==================================================
    // MAIN CATEGORIES
    // ==================================================
    populateCategories() {
        if (!this.mainList) return;

        this.mainList.innerHTML = "";

        const sorted = [...this.categories].sort((a, b) =>
            String(a.label ?? "").localeCompare(String(b.label ?? ""))
        );

        sorted.forEach((category) => {
            const item = document.createElement("div");

            item.className = "dropdownItem";
            item.textContent = category.label;
            item.setAttribute("role", "option");
            item.tabIndex = 0;

            const selectCategory = (event) => {
                event.stopPropagation();

                if (this.mainLabel) {
                    this.mainLabel.textContent = category.label;
                }

                const currentMain =
                    document.getElementById("currentMain");

                const currentSub =
                    document.getElementById("currentSub");

                if (currentMain) {
                    currentMain.textContent = category.label;
                }

                if (currentSub) {
                    currentSub.textContent = "";
                }

                // Reset the previous subcategory selection.
                if (this.subLabel) {
                    this.subLabel.textContent = "Select subcategory...";
                }

                this.populateSubcategories(category.label);

                this.subWrapper.style.display = "block";

                this.closeMain();
                this.closeSub();
            };

            item.addEventListener("click", selectCategory);

            item.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectCategory(event);
                }
            });

            this.mainList.appendChild(item);
        });
    },

    // ==================================================
    // SUBCATEGORIES
    // ==================================================
    populateSubcategories(categoryLabel) {
        if (!this.subList) return;

        this.subList.innerHTML = "";

        const sorted = this.subcategories
            .filter((entry) => entry.category === categoryLabel)
            .sort((a, b) =>
                String(a.subcategory ?? "").localeCompare(
                    String(b.subcategory ?? "")
                )
            );

        sorted.forEach((entry) => {
            const item = document.createElement("div");

            item.className = "dropdownItem";
            item.textContent = entry.subcategory;
            item.setAttribute("role", "option");
            item.tabIndex = 0;

            const selectSubcategory = (event) => {
                event.stopPropagation();

                if (this.subLabel) {
                    this.subLabel.textContent = entry.subcategory;
                }

                const currentSub =
                    document.getElementById("currentSub");

                if (currentSub) {
                    currentSub.textContent = entry.subcategory;
                }

                this.closeSub();

                if (typeof this.onSelect === "function") {
                    this.onSelect({
                        schemaId: entry.schemaId,
                        tsId: entry.tsId,
                        emailId: entry.emailId
                    });
                }

                this.closePanel();
            };

            item.addEventListener("click", selectSubcategory);

            item.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectSubcategory(event);
                }
            });

            this.subList.appendChild(item);
        });
    },

    // ==================================================
    // DROPDOWN VISIBILITY — MATCHES YOUR CSS
    // ==================================================
    toggleMain() {
        if (!this.mainWrapper) return;

        const isOpen = this.mainWrapper.classList.contains("open");

        this.closeSub();

        if (isOpen) {
            this.closeMain();
        } else {
            this.mainWrapper.classList.add("open");
        }
    },

    toggleSub() {
        if (!this.subWrapper) return;

        const isOpen = this.subWrapper.classList.contains("open");

        if (isOpen) {
            this.closeSub();
        } else {
            this.subWrapper.classList.add("open");
        }
    },

    closeMain() {
        this.mainWrapper?.classList.remove("open");
    },

    closeSub() {
        this.subWrapper?.classList.remove("open");
    }
};
