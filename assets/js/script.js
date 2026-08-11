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
        console.error("Fehler:", error);
        return;
    }

    console.log("Spieler:", data);

    const playersContainer = document.getElementById("players");

    playersContainer.innerHTML = "";

    data.forEach(player => {

        const button = document.createElement("button");

        button.textContent = player.nummer;

        playersContainer.appendChild(button);
    });
}

getPlayers();