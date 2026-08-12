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

const supabaseUrl =
    "https://mcdelwjwyrahrufjgnvu.supabase.co";

const supabaseKey =
    "sb_publishable_HBhsRhWExorIvdq4DHbO1Q_T1FOXofw";

const supabaseClient =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );

function menuFunction(x) {

    x.classList.toggle("change");

    document
        .getElementById("navLinks")
        .classList.toggle("show");
}

async function getCash() {

    const { data, error } =
        await supabaseClient
            .from("invoices")
            .select("gameday");

    if (error) {

        console.error(
            "Fehler beim Laden der Invoices:",
            error
        );

        return;
    }


    let balance = 0;
    let normalCount = 0;
    let gamedayCount = 0;


    data.forEach(invoice => {

        if (invoice.gameday) {

            balance += 4;
            gamedayCount++;

        } else {

            balance += 2;
            normalCount++;

        }

    });


    let sauelen = balance / 125


    document
        .getElementById("cashBalance")
        .textContent =
        balance.toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR"
        });


    document
        .getElementById("normalCount")
        .textContent =
        normalCount;


    document
        .getElementById("gamedayCount")
        .textContent =
        gamedayCount;

    document
        .getElementById("saeulenBalance")
        .textContent =
        sauelen;
}


getCash();