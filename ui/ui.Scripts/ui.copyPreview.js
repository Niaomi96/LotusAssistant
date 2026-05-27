// ======================================================
// ⭐ COPY PREVIEW MODULE (FINAL — Keyword Mapping +
//  Multi‑Entry + Cross‑Field + Null‑Safe Deduplication + Date Inside Troubleshooting)
// ======================================================

console.log("🟧 [COPY PREVIEW] Loaded");

export function initCopyPreview() {
    const modal = document.getElementById("copyPreviewModal");
    const closeBtn = document.getElementById("modalCloseBtn");
    const copyBtn = document.getElementById("modalCopyBtn");
    const textBox = document.getElementById("copyPreviewText");

    if (textBox) {
        textBox.style.maxHeight = "400px";
        textBox.style.overflowY = "auto";
        textBox.style.whiteSpace = "pre-wrap";
        textBox.style.padding = "10px";
    }

    closeBtn.onclick = () => modal.classList.add("hidden");

    copyBtn.onclick = () => {
        const text = textBox.innerText;
        navigator.clipboard.writeText(text);
        modal.classList.add("hidden");
        console.log("✅ [COPY PREVIEW] Copied to clipboard");
    };

    attachCopyButtons();
}

export function showCopyPreview(title, text) {
    document.getElementById("copyPreviewTitle").innerText = title;
    document.getElementById("copyPreviewText").innerText = text;
    document.getElementById("copyPreviewModal").classList.remove("hidden");
}

// ======================================================
// ⭐ BUTTON ATTACHMENT
// ======================================================
function attachCopyButtons() {
    const caseBtn = document.getElementById("copyCaseBtn");
    const emailBtn = document.getElementById("copyEmailBtn");

    if (caseBtn) {
        caseBtn.onclick = () => {
            const filteredText = collectFilledFields("#schemaContainer");
            showCopyPreview("Case Notes", filteredText);
        };
    }

   if (emailBtn) {
    emailBtn.onclick = () => {
        const text = document.getElementById("emailOutput").innerText.trim();
        const finalText = text || "No email content available.";

        showCopyPreview("Email Output", finalText);
    };
}
}

// ======================================================
// ⭐ DEDUPLICATION SAFEGUARD
// ======================================================
function safeAssign(target, value) {
    if (!value) return target;
    const normalizedTarget = target.trim().toLowerCase();
    const normalizedValue = value.trim().toLowerCase();
    if (!normalizedTarget) return value;
    if (normalizedTarget === normalizedValue) return target;
    if (normalizedTarget.includes(normalizedValue)) return target;
    return value;
}

// ======================================================
// ⭐ FIELD FILTERING + STRICT POSITIONAL MAPPING
// ======================================================
function collectFilledFields(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return "No case data found.";

    const inputs = container.querySelectorAll("input, select, textarea");
    const values = Array.from(inputs).map(el => el.value?.trim() || "");

    // ======================================================
    // ⭐ Keyword Maps
    // ======================================================
    const resultKeywords = ["resolved", "non-resolved","jc"];
    const nextStepKeywords = [
        "cmp",
        "manager escalation",
        "swap it",
        "t2 escalation",
        "active offer",
        "accept",
        "decline",
        "n/a",
        "j/c",
        "cog",
        "kyc transfer",
        "call back request",
        "raise rention",
        "resync sub",
        "jire ticket",
        "acknowledge update"
    ];
    const npsKeywords = ["y", "n","j.c"];
    const salesOppKeywords = ["y, interested", "n, not interested","j-c"];

    // ======================================================
    // ⭐ POSITIONAL MAPPING
    // ======================================================
    const mapped = {
        who: values[0],
        role: values[1],
        what: values[2],
        troubleshooting: "",
        results: "",
        nextSteps: "",
        nps: "",
        salesOpp: ""
    };

// ======================================================
// ⭐ CURRENCY (Case Notes Append)
// ======================================================
const currencyField = container.querySelector('select[data-label="Currency"], #Currency');
if (currencyField && currencyField.value.trim() && currencyField.value !== "N/A") {
    const currencyLine = `Currency: ${currencyField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(currencyLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + currencyLine;
    }
}

// ======================================================
// ⭐ INCREASE (Case Notes Append)
// ======================================================
const increaseField = container.querySelector('select[data-label="Increase"], #Increase');
if (increaseField && increaseField.value.trim() && increaseField.value !== "N/A") {
    const increaseLine = `Increase: ${increaseField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(increaseLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + increaseLine;
    }
}
// ======================================================
// ⭐ JIRE TICKET (Case Notes Append)
// ======================================================
const jireTicketField = container.querySelector('input[data-label="Jire Ticket"], #jireTicket');
if (jireTicket && jireTicket.value.trim()) {
    const jireTicket = `Jire Ticket: ${jireTicket.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(jireTicket.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + jireTicket;
    }
}

// ======================================================
// ⭐ BACK OFFICE LICENSES (Case Notes Append)
// ======================================================
const bolDeviceField = container.querySelector('input[data-label="Device"], #bolDevice');
if (bolDeviceField && bolDeviceField.value.trim()) {
    const bolDeviceLine = `Device: ${bolDeviceField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(bolDeviceLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + bolDeviceLine;
    }
}

const bolLocationField = container.querySelector('input[data-label="Location"], #bolLocation');
if (bolLocationField && bolLocationField.value.trim()) {
    const bolLocationLine = `Location: ${bolLocationField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(bolLocationLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + bolLocationLine;
    }
}

    
 // ======================================================
// ⭐ FAILED DPA DETAILS (Case Notes Append)
// ======================================================
const failedDPAField = container.querySelector('input[data-label="Failed DPA Details"], #failedDPA');
if (failedDPAField && failedDPAField.value.trim()) {
    const failedDPALine = `Failed DPA Details: ${failedDPAField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(failedDPALine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + failedDPALine;
    }
}

// ======================================================
// ⭐ US LOCATION PRICING CAMPAIGN DETAILS (Case Notes Append)
// ======================================================
const usLocationPricingCampaignField = container.querySelector('input[data-label="US Location Pricing Campaign Details"], #usLocationPricingCampaign');
if (usLocationPricingCampaignField && usLocationPricingCampaignField.value.trim()) {
    const usLocationPricingCampaignLine = `US Location Pricing Campaign Details: ${usLocationPricingCampaignField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(usLocationPricingCampaignLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + usLocationPricingCampaignLine;
    }
}

// ======================================================
// ⭐ RT US BING BRAND DETAILS (Case Notes Append)
// ======================================================
const rtUSBingBrandField = container.querySelector('input[data-label="RT US Bing Brand Details"], #rtUSBingBrand');
if (rtUSBingBrandField && rtUSBingBrandField.value.trim()) {
    const rtUSBingBrandLine = `RT US Bing Brand Details: ${rtUSBingBrandField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(rtUSBingBrandLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + rtUSBingBrandLine;
    }
}

// ======================================================
// ⭐ EVOPAYMENTS INBOUND TRACKING DETAILS (Case Notes Append)
// ======================================================
const evoPaymentsInboundTrackingField = container.querySelector('input[data-label="EvoPayments Inbound Tracking Details"], #evoPaymentsInboundTracking');
if (evoPaymentsInboundTrackingField && evoPaymentsInboundTrackingField.value.trim()) {
    const evoPaymentsInboundTrackingLine = `EvoPayments Inbound Tracking Details: ${evoPaymentsInboundTrackingField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(evoPaymentsInboundTrackingLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + evoPaymentsInboundTrackingLine;
    }
}

// ======================================================
// ⭐ BLACK BANNER (SUSPENDED ACCOUNT) DETAILS (Case Notes Append)
// ======================================================
const blackBannerSuspendedAccountField = container.querySelector('input[data-label="Black Banner (Suspended Account) Details"], #blackBannerSuspendedAccount');
if (blackBannerSuspendedAccountField && blackBannerSuspendedAccountField.value.trim()) {
    const blackBannerSuspendedAccountLine = `Black Banner (Suspended Account) Details: ${blackBannerSuspendedAccountField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(blackBannerSuspendedAccountLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + blackBannerSuspendedAccountLine;
    }
}

// ======================================================
// ⭐ CANCELED ACCOUNT DETAILS (Case Notes Append)
// ======================================================
const cancelAccountField = container.querySelector('input[data-label="Canceled Account Details"], #cancelAccount');
if (cancelAccountField && cancelAccountField.value.trim()) {
    const cancelAccountLine = `Canceled Account Details: ${cancelAccountField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(cancelAccountLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + cancelAccountLine;
    }
}

// ======================================================
// ⭐ STATIC CALL DETAILS (Case Notes Append)
// ======================================================
const staticCallField = container.querySelector('input[data-label="Static Call Details"], #stacticCall');
if (staticCallField && staticCallField.value.trim()) {
    const staticCallLine = `Static Call Details: ${staticCallField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(staticCallLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + staticCallLine;
    }
}

// ======================================================
// ⭐ BUTT DIAL DETAILS (Case Notes Append)
// ======================================================
const buttDialField = container.querySelector('input[data-label="Butt Dial Details"], #buttDial');
if (buttDialField && buttDialField.value.trim()) {
    const buttDialLine = `Butt Dial Details: ${buttDialField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(buttDialLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + buttDialLine;
    }
}
   
// ======================================================
// ⭐ BILLING COMPLAINT DETAILS (Case Notes Append)
// ======================================================
const billingComplaintField = container.querySelector('input[data-label="Billing Complaint Details"], #billingComplaint');
if (billingComplaintField && billingComplaintField.value.trim()) {
    const billingLine = `Billing Complaint Details: ${billingComplaintField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(billingLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + billingLine;
    }
}

// ======================================================
// ⭐ SERVICES COMPLAINT DETAILS (Case Notes Append)
// ======================================================
const servicesComplaintField = container.querySelector('input[data-label="Services Complaint Details"], #servicesComplaint');
if (servicesComplaintField && servicesComplaintField.value.trim()) {
    const servicesLine = `Services Complaint Details: ${servicesComplaintField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(servicesLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + servicesLine;
    }
}

// ======================================================
// ⭐ MIS‑SOLD COMPLAINT DETAILS (Case Notes Append)
// ======================================================
const misSoldComplaintField = container.querySelector('input[data-label="Mis-Sold Complaint Details"], #misSoldComplaint');
if (misSoldComplaintField && misSoldComplaintField.value.trim()) {
    const misSoldLine = `Mis-Sold Complaint Details: ${misSoldComplaintField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(misSoldLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + misSoldLine;
    }
}


// ======================================================
// ⭐ WHAT (Troubleshooting Append)
// ======================================================
const whatField = container.querySelector('input[data-label="WHAT"], #what');
if (whatField && whatField.value.trim()) {
    const whatLine = `WHAT: ${whatField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(whatLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + whatLine;
    }
}

// ======================================================
// ⭐ PRINTER TYPE (Troubleshooting Append)
// ======================================================
const printerTypeField = container.querySelector('select[data-label="Printer Type"], #printerType');
if (printerTypeField && printerTypeField.value.trim()) {
    const printerLine = `Printer Type: ${printerTypeField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(printerLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + printerLine;
    }
}

// ======================================================
// ⭐ CONNECTION TYPE (Troubleshooting Append)
// ======================================================
const connectionTypeField = container.querySelector('select[data-label="Connection Type"], #connectionType');
if (connectionTypeField && connectionTypeField.value.trim()) {
    const connectionLine = `Connection Type: ${connectionTypeField.value.trim()}`;
    if (!mapped.troubleshooting.toLowerCase().includes(connectionLine.toLowerCase())) {
        mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + connectionLine;
    }
}

     
     // ======================================================
        // ⭐ JIRE TICKET NUMBER (Troubleshooting Append)
        // ======================================================
        const jireTicketField = container.querySelector('input[data-label="JIRE Ticket Number"], #jireTicketNumber');
        if (jireTicketField && jireTicketField.value.trim()) {
            const jireLine = `JIRE Ticket Number: ${jireTicketField.value.trim()}`;
            if (!mapped.troubleshooting.toLowerCase().includes(jireLine.toLowerCase())) {
                mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + jireLine;
            }
        }


    // ======================================================
    // ⭐ RT TICKET NUMBER (Troubleshooting Append)
    // ======================================================
    const rtTicketField = container.querySelector('input[data-label="RT Ticket Number"], #rtTicketNumber');
    if (rtTicketField && rtTicketField.value.trim()) {
        const ticketLine = `RT Ticket Number: ${rtTicketField.value.trim()}`;
        if (!mapped.troubleshooting.toLowerCase().includes(ticketLine.toLowerCase())) {
            mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + ticketLine;
        }
    }

    // ======================================================
    // ⭐ ADYEN VOLUME ADJUSTMENT (Troubleshooting Append)
    // ======================================================
    const adyenActionField = container.querySelector('select[data-label="Volume Adjustment"], #volumeAdjustment');
    if (adyenActionField && adyenActionField.value.trim()) {
        const actionLine = `Volume Adjustment: ${adyenActionField.value.trim()}`;
        if (!mapped.troubleshooting.toLowerCase().includes(actionLine.toLowerCase())) {
            mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + actionLine;
        }
    }


    // ======================================================
    // ⭐ DATE → APPEND INTO TROUBLESHOOTING (LIKE MULTI‑ENTRY)
// ======================================================
    const dateField = container.querySelector('input[type="date"], .calendarInput');
    if (dateField && dateField.value.trim()) {
        const dateLine = `Date: ${dateField.value.trim()}`;
        if (!mapped.troubleshooting.toLowerCase().includes(dateLine.toLowerCase())) {
            mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + dateLine;
        }
    }

    // ======================================================
    // ⭐ TROUBLESHOOTING CANDIDATES (indexes 3–6)
// ======================================================
    const troubleshootingCandidates = [values[3], values[4], values[5], values[6]];

    troubleshootingCandidates.forEach(v => {
        if (!v) return;

        const normalized = v
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .replace(/\s+/g, " ");

        const isMultiEntryValue =
            ["$", "£"].includes(v) ||
            /^\d+(\.\d+)?$/.test(v) ||
            /^[a-z0-9]+$/i.test(v);

        const isDropdownValue =
            resultKeywords.includes(normalized) ||
            nextStepKeywords.includes(normalized) ||
            npsKeywords.includes(normalized) ||
            salesOppKeywords.includes(normalized);

        const isDuplicateOrNull =
            [mapped.results, mapped.nextSteps, mapped.nps, mapped.salesOpp]
                .some(field => !field || field.toLowerCase() === v.toLowerCase());

        if (isMultiEntryValue || isDropdownValue || isDuplicateOrNull) return;

        const newText = v.trim();
        if (!mapped.troubleshooting.toLowerCase().includes(newText.toLowerCase())) {
            mapped.troubleshooting += (mapped.troubleshooting ? "\n" : "") + newText;
        }
    });

    // ======================================================
    // ⭐ MULTI‑ENTRY EXTRACTION
    // ======================================================
    const multiEntryWrappers = [
        "Manual Refund Currency",
        "Missing Funds",
        "Devices Not on Platform"
    ];

    multiEntryWrappers.forEach(label => {
        const wrapper = document.querySelector(`.multiEntryWrapper[data-label="${label}"]`);
        if (!wrapper) return;

        const rows = wrapper.querySelectorAll(".multiEntryRow");
        const uniqueEntries = new Set();
        const listLines = [];

        rows.forEach(row => {
            const parts = [];
            row.querySelectorAll(".multiEntryInput.fieldInput").forEach(el => {
                const lbl = el.dataset.label || el.dataset.field || "";
                const val = el.value?.trim();
                if (val) parts.push(`${lbl}: ${val}`);
            });

            if (parts.length) {
                const entry = `${label} → ${parts.join(" | ")}`;
                if (!uniqueEntries.has(entry)) {
                    uniqueEntries.add(entry);
                    listLines.push(entry);
                }
            }
        });

        if (listLines.length) {
            const combined = listLines.join("\n");
            if (!mapped.troubleshooting.toLowerCase().includes(combined.toLowerCase())) {
                mapped.troubleshooting +=
                    (mapped.troubleshooting ? "\n" : "") + combined;
            }
        }
    });

    // ======================================================
    // ⭐ DYNAMIC FALLBACKS — USE ORIGINAL FIELD TEXT + DEDUPLICATION
    // ======================================================
    const lowerValues = values.map(v => v.toLowerCase());

    if (!mapped.results) {
        const found = lowerValues.find(v => resultKeywords.includes(v));
        if (found) mapped.results = safeAssign(mapped.results, values[lowerValues.indexOf(found)]);
    }
    if (!mapped.nextSteps) {
        const found = lowerValues.find(v => nextStepKeywords.includes(v));
        if (found) mapped.nextSteps = safeAssign(mapped.nextSteps, values[lowerValues.indexOf(found)]);
    }
    if (!mapped.nps) {
        const found = lowerValues.find(v => npsKeywords.includes(v));
        if (found) mapped.nps = safeAssign(mapped.nps, values[lowerValues.indexOf(found)]);
    }
    if (!mapped.salesOpp) {
        const found = lowerValues.find(v => salesOppKeywords.includes(v));
        if (found) mapped.salesOpp = safeAssign(mapped.salesOpp, values[lowerValues.indexOf(found)]);
    }

    // ======================================================
    // ⭐ EMPTY TROUBLESHOOTING HANDLER
    // ======================================================
    if (!mapped.troubleshooting || !mapped.troubleshooting.trim()) {
        mapped.troubleshooting = "No Troubleshooting Steps";
    }

    // ======================================================
    // ⭐ FINAL OUTPUT
    // ======================================================
    return `
Who: ${mapped.who}
Role: ${mapped.role}
What: ${mapped.what}
Troubleshooting: ${mapped.troubleshooting}
Results: ${mapped.results}
Next Steps: ${mapped.nextSteps}
NPS: ${mapped.nps}
Sales Opportunity Explored: ${mapped.salesOpp}
`.trim();
}

// ======================================================
// ⭐ AUTO‑INIT
// ======================================================
document.addEventListener("DOMContentLoaded", initCopyPreview);






