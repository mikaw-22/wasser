let invoiceToDelete = null;


const supabaseUrl = "https://mcdelwjwyrahrufjgnvu.supabase.co";
const supabaseKey = "sb_publishable_HBhsRhWExorIvdq4DHbO1Q_T1FOXofw";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


function menuFunction(x) {

    x.classList.toggle("change");

    document
        .getElementById("navLinks")
        .classList.toggle("show");
}


async function getInvoices() {

    const { data, error } = await supabaseClient
        .from("invoices")
        .select("*")
        .order("time", { ascending: false });

    if (error) {
        console.error("Fehler beim Laden der Invoices:", error);
        return;
    }

    const invoicesContainer = document.getElementById("invoices");

    if (!invoicesContainer) {
        return;
    }

    invoicesContainer.innerHTML = "";

    data.forEach(invoice => {

        const invoiceElement = document.createElement("div");

        invoiceElement.classList.add("invoice");

        const date = new Date(invoice.time);


        invoiceElement.innerHTML = `
            <button class="delete-invoice" title="Eintrag löschen">
                <span class="material-symbols-outlined">delete</span>
            </button>

            <div class="invoice-header">
                <strong>${invoice.number}</strong>
                <span>${invoice.vorname} ${invoice.name}</span>
            </div>

            <div class="invoice-time">
                ${date.toLocaleDateString("de-DE")} ·
                ${date.toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit"
                })}
            </div>

            <div class="invoice-status">
                <span>
                    Bezahlt: ${invoice.paid ? "✓" : "✕"}
                </span>

                <span>
                    Spieltag: ${invoice.gameday ? "✓" : "✕"}
                </span>
            </div>
        `;


        const deleteButton =
            invoiceElement.querySelector(".delete-invoice");


        deleteButton.addEventListener("click", () => {

            invoiceToDelete = invoice.id;

            document
                .getElementById("deletePopup")
                .classList.add("show");
        });


        invoicesContainer.appendChild(invoiceElement);
    });
}


async function deleteInvoice(invoiceId) {

    const { error } = await supabaseClient
        .from("invoices")
        .delete()
        .eq("id", invoiceId);

    if (error) {
        console.error("Fehler beim Löschen:", error);
        return;
    }

    console.log("Invoice gelöscht:", invoiceId);

    await getInvoices();
}


// Nein
document
    .getElementById("cancelDelete")
    .addEventListener("click", () => {

        invoiceToDelete = null;

        document
            .getElementById("deletePopup")
            .classList.remove("show");
    });


// Ja
document
    .getElementById("confirmDelete")
    .addEventListener("click", async () => {

        if (invoiceToDelete === null) {
            return;
        }

        await deleteInvoice(invoiceToDelete);

        invoiceToDelete = null;

        document
            .getElementById("deletePopup")
            .classList.remove("show");
    });


getInvoices();

