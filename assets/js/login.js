function uhrzeitAnzeigen() {

    const now = new Date();

    const date_time = now.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const dateTimeElement =
        document.getElementById("date_time");

    if (dateTimeElement) {
        dateTimeElement.textContent = date_time;
    }
}

uhrzeitAnzeigen();
setInterval(uhrzeitAnzeigen, 1000);

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
// LOGIN
// =========================

async function login() {

    const password =
        document
            .getElementById("zugang")
            .value;


    const { data, error } =
        await supabaseClient
            .from("passwords")
            .select("id")
            .eq("password", password)
            .maybeSingle();


    if (error) {

        console.error(error);

        alert("Fehler beim Login.");

        return;
    }


    if (data) {

        window.location.href = "players.html";

    } else {

        document
            .getElementById("falsePasswordPopup")
            .classList.add("show");

    }

}

document
    .getElementById("closeFalsePasswordPopup")
    .addEventListener("click", () => {

        document
            .getElementById("falsePasswordPopup")
            .classList.remove("show");

    });

