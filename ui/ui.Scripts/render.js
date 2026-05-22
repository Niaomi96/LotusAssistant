// ===============================
// RENDERER.JS — UNIVERSAL SCHEMA RENDERER
// ===============================

export function renderSchema(schema) {
    const container = document.getElementById("schemaContainer");
    if (!container) return;

    container.innerHTML = "";

    if (!schema || !schema.caseNotes) {
        container.innerHTML = "<p>No case notes available.</p>";
        return;
    }

    Object.entries(schema.caseNotes).forEach(([sectionName, sectionData]) => {
        const sectionWrapper = document.createElement("div");
        sectionWrapper.classList.add("sectionWrapper");

        const sectionTitle = document.createElement("h3");
        sectionTitle.textContent = sectionName;
        sectionWrapper.appendChild(sectionTitle);

        if (sectionData.fields) {
            const fieldsWrapper = document.createElement("div");
            fieldsWrapper.classList.add("fieldsWrapper");

            Object.entries(sectionData.fields).forEach(([fieldKey, fieldConfig]) => {

                // ⭐ NEW: SECTION SUPPORT
                if (fieldConfig.type === "section") {
                    const sectionRow = document.createElement("div");
                    sectionRow.classList.add("fieldRow");
                    sectionRow.dataset.type = "section";
                    sectionRow.dataset.field = fieldKey;
                    sectionRow.dataset.label = fieldConfig.label;

                    if (fieldConfig.visibleWhen) {
                        sectionRow.style.display = "none";
                        sectionRow.dataset.visibleWhen = JSON.stringify(fieldConfig.visibleWhen);
                    }

                    // Label
                    const label = document.createElement("label");
                    label.classList.add("fieldLabel");
                    label.textContent = fieldConfig.label;
                    sectionRow.appendChild(label);

                    // Children container
                    const children = document.createElement("div");
                    children.classList.add("fieldChildren");

                    // Render inner fields
                    Object.entries(fieldConfig.fields).forEach(([childKey, childConfig]) => {
                        const childRow = document.createElement("div");
                        childRow.classList.add("fieldRow");
                        childRow.dataset.field = childKey;
                        childRow.dataset.label = childConfig.label;

                        const childLabel = document.createElement("label");
                        childLabel.textContent = childConfig.label;
                        childRow.appendChild(childLabel);

                        let input;

                        if (childConfig.type === "dropdown") {
                            input = document.createElement("select");

                            const empty = document.createElement("option");
                            empty.value = "";
                            empty.textContent = "-- Select --";
                            input.appendChild(empty);

                            childConfig.options.forEach(optVal => {
                                const opt = document.createElement("option");
                                opt.value = optVal;
                                opt.textContent = optVal;
                                input.appendChild(opt);
                            });

                        } else {
                            input = document.createElement("input");
                            input.type = "text";
                        }

                        input.classList.add("fieldInput");
                        input.dataset.label = childConfig.label;

                        childRow.appendChild(input);
                        children.appendChild(childRow);
                    });

                    sectionRow.appendChild(children);
                    fieldsWrapper.appendChild(sectionRow);
                    return;
                }

                // ⭐ EXISTING LOGIC (unchanged)
                const fieldRow = document.createElement("div");
                fieldRow.classList.add("fieldRow");
                fieldRow.setAttribute("data-field", fieldKey);
                fieldRow.setAttribute("data-label", fieldConfig.label);

                if (fieldConfig.visibleWhen) {
                    fieldRow.style.display = "none";
                    fieldRow.dataset.visibleWhen = JSON.stringify(fieldConfig.visibleWhen);
                }

                const label = document.createElement("label");
                label.textContent = fieldConfig.label;
                fieldRow.appendChild(label);

                let inputElement;

                if (fieldConfig.type === "dropdown") {
                    inputElement = document.createElement("select");

                    const empty = document.createElement("option");
                    empty.value = "";
                    empty.textContent = "-- Select --";
                    inputElement.appendChild(empty);

                    if (Array.isArray(fieldConfig.options)) {
                        fieldConfig.options.forEach(option => {
                            const opt = document.createElement("option");
                            opt.value = option;
                            opt.textContent = option;
                            inputElement.appendChild(opt);
                        });
                    }

                } else if (fieldConfig.type === "multi-entry") {
                    inputElement = createMultiEntryField(fieldConfig);

                } else {
                    inputElement = document.createElement("input");
                    inputElement.type = "text";
                }

                inputElement.classList.add("fieldInput");
                inputElement.dataset.label = fieldConfig.label;

                fieldRow.appendChild(inputElement);
                fieldsWrapper.appendChild(fieldRow);
            });

            sectionWrapper.appendChild(fieldsWrapper);
        }

        container.appendChild(sectionWrapper);
    });
}

// ===============================
// MULTI-ENTRY FIELD SUPPORT
// ===============================
function createMultiEntryField(fieldConfig) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("multiEntryWrapper");

    const list = document.createElement("div");
    list.classList.add("multiEntryList");
    wrapper.appendChild(list);

    const addBtn = document.createElement("button");
    addBtn.textContent = "+ Add";
    addBtn.classList.add("multiEntryAddBtn");

    addBtn.addEventListener("click", () => {
        const row = document.createElement("div");
        row.classList.add("multiEntryRow", "horizontalRow");

        Object.entries(fieldConfig.fields).forEach(([subKey, subField]) => {
            let input;

            if (subField.type === "dropdown") {
                input = document.createElement("select");

                const empty = document.createElement("option");
                empty.value = "";
                empty.textContent = "-- Select --";
                input.appendChild(empty);

                subField.options.forEach(optVal => {
                    const opt = document.createElement("option");
                    opt.value = optVal;
                    opt.textContent = optVal;
                    input.appendChild(opt);
                });

            } else {
                input = document.createElement("input");
                input.type = "text";
            }

            input.classList.add("multiEntryInput", "fieldInput");
            input.dataset.label = subField.label;

            row.appendChild(input);
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "X";
        removeBtn.classList.add("multiEntryRemoveBtn");

        removeBtn.addEventListener("click", () => {
            row.remove();
        });

        row.appendChild(removeBtn);
        list.appendChild(row);
    });

    wrapper.appendChild(addBtn);
    return wrapper;
}

export function clearSchema() {
    const container = document.getElementById("schemaContainer");
    if (container) container.innerHTML = "";
}