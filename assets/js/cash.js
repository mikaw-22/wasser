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