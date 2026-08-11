function uhrzeitAnzeigen() {
    const now = new Date();

    const date_time = now.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    document.getElementById("date_time").textContent = date_time;
}

uhrzeitAnzeigen();
setInterval(uhrzeitAnzeigen, 1000);





const supabaseUrl = "https://mcdelwjwyrahrufjgnvu.supabase.co";
const supabaseKey = "sb_publishable_HBhsRhWExorIvdq4DHbO1Q_T1FOXofw";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);






async function getPlayers() {

    const { data, error } = await supabaseClient
        .from("players")
        .select("*")
        .order("nummer", { ascending: true });

    if (error) {
        console.error("Fehler beim Laden der Spieler:", error);
        return;
    }

    const playersContainer = document.getElementById("players");

    playersContainer.innerHTML = "";

    data.forEach(player => {

        const button = document.createElement("button");

        button.textContent = player.nummer;

        // Spieler beim Klick speichern
        button.addEventListener("click", () => {
            createInvoice(player);
        });

        playersContainer.appendChild(button);
    });
}









async function createInvoice(player) {

    const { data, error } = await supabaseClient
        .from("invoices")
        .insert({
            id: player.id,
            name: player.name,
            vorname: player.vorname,
            number: player.nummer,
            paid: false,
            time: new Date().toISOString(),
            gameday: false
        })
        .select();

    if (error) {
        console.error("Fehler beim Erstellen der Invoice:", error);
        return;
    }

    console.log("Invoice erstellt:", data);
}

getPlayers();









async function login() {
    const password = document.getElementById("zugang").value;

    const { data, error } = await supabaseClient
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
        alert("Falsches Passwort.");
    }
}






function menuFunction(x) {
    x.classList.toggle("change");
    // document.getElementById("navLinks").classList.toggle("show");
}