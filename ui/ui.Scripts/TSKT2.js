// ---------------------------------------------------
// ⭐ UNIVERSAL SCHEMA‑DRIVEN TS LOADER (TSKT2.js)
// ---------------------------------------------------

window.TSKT2 = {

    tsId: null,
    tsEntry: null,
    enabled: false,
    logicKeywords: null,

    init(tsPayload) {
        console.log("🟦 TSKT2.init() payload:", tsPayload);

        // ⭐ ONLY RUN IF KEYWORD TROUBLESHOOTING EXISTS
        const hasKeywords =
            tsPayload?.tsEntry?.keywordTroubleshooting &&
            Object.keys(tsPayload.tsEntry.keywordTroubleshooting).length > 0;

        if (!hasKeywords) {
            console.log("🟥 TSKT2 disabled — no keywordTroubleshooting found.");
            this.enabled = false;
            return;
        }

        // ⭐ KEYWORD MODE ENABLED
        this.enabled = true;

        this.tsId = tsPayload.tsId;
        this.tsEntry = tsPayload.tsEntry;

        // ⭐ FIXED: READ LOGIC FROM CE.js OUTPUT
        this.logicKeywords = tsPayload?.logic?.keywordSelected || {};

        console.log("🟩 TSKT2 ENABLED");
        console.log("🟩 logic = keywords:", this.logicKeywords);
        console.log("🟩 tsEntry.keywordTroubleshooting:", this.tsEntry.keywordTroubleshooting);

        this.bindEvents();
    },

    bindEvents() {
        if (!this.enabled) return;

        document.addEventListener("change", e => {
            const el = e.target;

            // ⭐ Keyword selection
            if (el.dataset.label === "Keyword Selected") {
                console.log("🟦 Keyword Selected changed:", el.value);
                this.handleKeyword(el.value);
                return;
            }

            // ⭐ T2 escalation
            if (el.dataset.label === "Next Steps" && el.value === "T2 Escalation") {
                const keyword = document.querySelector("select[data-label='Keyword Selected']")?.value;
                console.log("🟦 T2 Escalation triggered for keyword:", keyword);
                if (keyword) this.applyT2(keyword);
                return;
            }
        });
    },

    handleKeyword(keyword) {
        if (!this.enabled || !keyword) return;

        console.log("🟦 handleKeyword() fired for:", keyword);

        // ⭐ logic comes from CE.js
        const keywordConfig = this.logicKeywords?.[keyword];
        console.log("🟦 logic keywordConfig:", keywordConfig);

        if (!keywordConfig) {
            console.log("🟥 No logic entry for keyword:", keyword);
            return;
        }

        // ⭐ Update WHAT
        this.updateWHAT(keywordConfig.what);

        // ⭐ Map to troubleshooting steps (TSID)
        const mapKey = keywordConfig.mapTo;
        const steps = this.getSteps(mapKey);

        console.log("🟦 mapKey:", mapKey);
        console.log("🟦 steps:", steps);

        const container = document.getElementById("troubleshootingContainer");
        if (container) container.innerHTML = "";

        if (steps) this.renderSteps(steps);
    },

    updateWHAT(text) {
        if (!this.enabled) return;

        const whatField = document.querySelector('input[data-label="WHAT"]');

        console.log("🟪 updateWHAT() CALLED");
        console.log("🟪 WHAT text received:", text);
        console.log("🟪 WHAT field element:", whatField);

        if (!whatField) {
            console.log("🟥 WHAT field not found.");
            return;
        }

        whatField.value = text || "";

        console.log("🟪 WHAT field updated to:", whatField.value);
    },

    getSteps(mapKey) {
        if (!this.enabled) return null;

        return this.tsEntry?.keywordTroubleshooting?.[mapKey] || null;
    },

    renderSteps(steps) {
        if (!this.enabled) return;

        const container = document.getElementById("troubleshootingContainer");
        if (!container) {
            console.log("🟥 troubleshootingContainer not found.");
            return;
        }

        console.log("🟦 Rendering steps:", steps);

        container.innerHTML = steps.map(s => `<p>• ${s}</p>`).join("");
    },

    applyT2(keyword) {
        if (!this.enabled) return;

        console.log("🟦 applyT2() for:", keyword);

        const keywordConfig = this.logicKeywords?.[keyword];
        if (!keywordConfig) {
            console.log("🟥 No logic entry for T2 keyword:", keyword);
            return;
        }

        const mapKey = keywordConfig.mapTo;
        const steps = this.getSteps(mapKey);
        if (!steps) {
            console.log("🟥 No steps found for T2 mapKey:", mapKey);
            return;
        }

        const whatField = document.querySelector('input[data-label="WHAT"]');
        if (!whatField) {
            console.log("🟥 WHAT field not found for T2.");
            return;
        }

        whatField.value =
            `${keyword} — Full Troubleshooting:\n${steps.join("\n")}`;
    }
};
