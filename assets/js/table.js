let invoiceToDelete = null;
let allInvoices = [];


// =========================
// UHRZEIT
// =========================

function uhrzeitAnzeigen() {

    const now = new Date();

    const date_time = now.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const element = document.getElementById("date_time");

    if (element) {
        element.textContent = date_time;
    }
}

uhrzeitAnzeigen();
setInterval(uhrzeitAnzeigen, 1000);


// =========================
// FILTER-MENÜ
// =========================

function filterFunction() {

    document
        .getElementById("filters")
        .classList.toggle("show");
}


// =========================
// SUPABASE
// =========================

const supabaseUrl =
    "https://mcdelwjwyrahrufjgnvu.supabase.co";

const supabaseKey =
    "sb_publishable_HBhsRhWExorIvdq4DHbO1Q_T1FOXofw";

const supabaseClient =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );


// =========================
// HAUPTMENÜ
// =========================

function menuFunction(x) {

    x.classList.toggle("change");

    document
        .getElementById("navLinks")
        .classList.toggle("show");
}


// =========================
// INVOICES AUS DB LADEN
// =========================

async function getInvoices() {

    const { data, error } =
        await supabaseClient
            .from("invoices")
            .select("*")
            .order("time", {
                ascending: false
            });


    if (error) {

        console.error(
            "Fehler beim Laden der Invoices:",
            error
        );

        return;
    }


    // Alle Invoices speichern
    allInvoices = data;


    // Spielerfilter erstellen
    loadPlayerFilter();


    // Alle anzeigen
    renderInvoices(allInvoices);
}


// =========================
// INVOICES ANZEIGEN
// =========================

function renderInvoices(invoices) {

    const invoicesContainer =
        document.getElementById("invoices");

    if (!invoicesContainer) {
        return;
    }

    invoicesContainer.innerHTML = "";

    invoices.forEach(invoice => {

        const invoiceElement =
            document.createElement("div");

        invoiceElement.classList.add("invoice");

        const date =
            new Date(invoice.time);

        invoiceElement.innerHTML = `

            <button class="delete-invoice" title="Eintrag löschen">
                <span class="material-symbols-outlined">
                    delete
                </span>
            </button>

            <div class="invoice-header">

                <strong>
                    ${invoice.number}
                </strong>

                <span>
                    ${invoice.vorname}
                    <!--${invoice.name}-->
                </span>

            </div>

            <div class="invoice-time">

                ${date.toLocaleDateString("de-DE")}
                ·
                ${date.toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit"
                })}

            </div>

            <div class="invoice-status">

                <span>
                    Bezahlt:
                    ${invoice.paid ? "✓" : "✕"}
                </span>

                <span>
                    Spieltag:
                    ${invoice.gameday ? "✓" : "✕"}
                </span>

            </div>

            <button class="photo-invoice" title="Foto ansehen">
                <i class="fa-solid fa-camera" style="color: #008cff"></i>
            </button>
        `;


        // =========================
        // LÖSCHEN
        // =========================

        const deleteButton =
            invoiceElement.querySelector(
                ".delete-invoice"
            );

        deleteButton.addEventListener(
            "click",
            () => {

                invoiceToDelete =
                    invoice.id;

                document
                    .getElementById("deletePopup")
                    .classList.add("show");
            }
        );


        // =========================
        // FOTO ANSEHEN
        // =========================

        const photoButton =
            invoiceElement.querySelector(
                ".photo-invoice"
            );

        photoButton.addEventListener(
            "click",
            () => {

                // Kein Foto vorhanden
                if (!invoice.photo) {

                    document
                        .getElementById("nophotoPopup")
                        .classList.add("show");

                    return;
                }


                // Öffentliche URL des Fotos holen
                const { data } =
                    supabaseClient
                        .storage
                        .from("invoice-photos")
                        .getPublicUrl(
                            invoice.photo
                        );


                // Bild setzen
                document
                    .getElementById("invoicePhoto")
                    .src =
                    data.publicUrl;


                // Popup öffnen
                document
                    .getElementById("photoPopup")
                    .classList.add("show");
            }
        );


        // =========================
        // INVOICE HINZUFÜGEN
        // =========================

        invoicesContainer.appendChild(
            invoiceElement
        );

    });


    // =========================
    // KEINE ERGEBNISSE
    // =========================

    if (invoices.length === 0) {

        invoicesContainer.innerHTML = `
            <p class="no-invoices">
                Keine Einträge gefunden.
            </p>
        `;
    }
}

document
    .getElementById("closePhotoPopup")
    .addEventListener("click", () => {

        document
            .getElementById("photoPopup")
            .classList.remove("show");

        document
            .getElementById("invoicePhoto")
            .src = "";
    });

document
    .getElementById("closeNophotoPopup")
    .addEventListener("click", () => {
        document
            .getElementById("nophotoPopup")
            .classList.remove("show");
    });

// =========================
// FILTER
// =========================

function applyFilters() {

    const player =
        document
            .getElementById("filterPlayer")
            .value;


    const paid =
        document
            .getElementById("filterPaid")
            .value;


    const gameday =
        document
            .getElementById("filterGameday")
            .value;


    const dateFrom =
        document
            .getElementById("filterDateFrom")
            .value;


    const dateTo =
        document
            .getElementById("filterDateTo")
            .value;


    const filteredInvoices =
        allInvoices.filter(invoice => {


            // =====================
            // SPIELER
            // =====================

            if (
                player !== "" &&
                invoice.number.toString() !== player
            ) {

                return false;

            }


            // =====================
            // BEZAHLT
            // =====================

            if (
                paid !== "" &&
                invoice.paid.toString() !== paid
            ) {

                return false;

            }


            // =====================
            // SPIELTAG
            // =====================

            if (
                gameday !== "" &&
                invoice.gameday.toString() !== gameday
            ) {

                return false;

            }


            // =====================
            // DATUM VON
            // =====================

            if (dateFrom !== "") {

                const invoiceDate =
                    new Date(invoice.time);


                const from =
                    new Date(dateFrom);


                from.setHours(
                    0,
                    0,
                    0,
                    0
                );


                if (invoiceDate < from) {

                    return false;

                }

            }


            // =====================
            // DATUM BIS
            // =====================

            if (dateTo !== "") {

                const invoiceDate =
                    new Date(invoice.time);


                const to =
                    new Date(dateTo);


                to.setHours(
                    23,
                    59,
                    59,
                    999
                );


                if (invoiceDate > to) {

                    return false;

                }

            }


            return true;

        });


    renderInvoices(
        filteredInvoices
    );

}


// =========================
// FILTER-EVENTS
// =========================

document
    .getElementById("filterPlayer")
    .addEventListener(
        "change",
        applyFilters
    );


document
    .getElementById("filterPaid")
    .addEventListener(
        "change",
        applyFilters
    );


document
    .getElementById("filterGameday")
    .addEventListener(
        "change",
        applyFilters
    );


document
    .getElementById("filterDateFrom")
    .addEventListener(
        "change",
        applyFilters
    );


document
    .getElementById("filterDateTo")
    .addEventListener(
        "change",
        applyFilters
    );


// =========================
// SPIELER-FILTER
// =========================

function loadPlayerFilter() {

    const select =
        document.getElementById(
            "filterPlayer"
        );


    if (!select) {
        return;
    }


    // Alte Optionen entfernen
    select.innerHTML = `
        <option value="">
            Alle Spieler
        </option>
    `;


    const players = [];


    allInvoices.forEach(invoice => {

        const exists =
            players.find(
                player =>
                    player.number === invoice.number
            );


        if (!exists) {

            players.push({

                number:
                    invoice.number,

                name:
                    invoice.vorname +
                    " " +
                    invoice.name

            });

        }

    });


    players.sort(
        (a, b) =>
            Number(a.number) -
            Number(b.number)
    );


    players.forEach(player => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            player.number;


        option.textContent =
            `${player.number} – ${player.name}`;


        select.appendChild(
            option
        );

    });

}


// =========================
// INVOICE LÖSCHEN
// =========================

async function deleteInvoice(invoiceId) {

    const { error } =
        await supabaseClient
            .from("invoices")
            .delete()
            .eq("id", invoiceId);


    if (error) {

        console.error(
            "Fehler beim Löschen:",
            error
        );

        return;

    }


    console.log(
        "Invoice gelöscht:",
        invoiceId
    );


    await getInvoices();

}


// =========================
// POPUP → NEIN
// =========================

document
    .getElementById("cancelDelete")
    .addEventListener(
        "click",
        () => {

            invoiceToDelete = null;


            document
                .getElementById("deletePopup")
                .classList.remove("show");

        }
    );


// =========================
// POPUP → JA
// =========================

document
    .getElementById("confirmDelete")
    .addEventListener(
        "click",
        async () => {

            if (
                invoiceToDelete === null
            ) {

                return;

            }


            await deleteInvoice(
                invoiceToDelete
            );


            invoiceToDelete = null;


            document
                .getElementById("deletePopup")
                .classList.remove("show");

        }
    );


// =========================
// START
// =========================

getInvoices();

