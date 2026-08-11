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
// AUSGEWÄHLTER SPIELER
// =========================

let selectedPlayer = null;


// =========================
// SPIELER LADEN
// =========================

async function getPlayers() {

    const { data, error } =
        await supabaseClient
            .from("players")
            .select("*")
            .order("nummer", {
                ascending: true
            });


    if (error) {

        console.error(
            "Fehler beim Laden der Spieler:",
            error
        );

        return;
    }


    const playersContainer =
        document.getElementById("players");


    if (!playersContainer) {
        return;
    }


    playersContainer.innerHTML = "";


    data.forEach(player => {

        const button =
            document.createElement("button");


        button.textContent =
            player.nummer;


        // =========================
        // SPIELER ANGEKLICKT
        // =========================

        button.addEventListener("click", () => {

            selectedPlayer = player;


            document
                .getElementById("popupPlayerName")
                .textContent =
                `Willst du ${player.vorname} ${player.name} 2€ eintragen?`;


            document
                .getElementById("matchdayCheckbox")
                .checked = false;


            // Foto zurücksetzen

            const photoInput =
                document.getElementById("playerPhoto");

            const photoName =
                document.getElementById("selectedPhotoName");

            const photoLabel =
                document.getElementById("photoUploadLabel");


            if (photoInput) {
                photoInput.value = "";
            }


            if (photoName) {
                photoName.textContent = "";
            }


            if (photoLabel) {
                photoLabel.classList.remove(
                    "photo-selected"
                );
            }


            // Popup öffnen

            document
                .getElementById("playerPopup")
                .classList.add("show");

        });


        playersContainer.appendChild(button);

    });

}


// =========================
// FOTO AUSWÄHLEN
// =========================

const playerPhoto =
    document.getElementById("playerPhoto");

const photoUploadLabel =
    document.getElementById("photoUploadLabel");

const selectedPhotoName =
    document.getElementById("selectedPhotoName");


if (playerPhoto) {

    playerPhoto.addEventListener(
        "change",
        () => {

            if (
                playerPhoto.files.length === 0
            ) {
                return;
            }


            const photoFile =
                playerPhoto.files[0];


            // Dateiname anzeigen

            if (selectedPhotoName) {

                selectedPhotoName.textContent =
                    photoFile.name;

            }


            // Button deaktivieren

            if (photoUploadLabel) {

                photoUploadLabel.classList.add(
                    "photo-selected"
                );

            }

        }
    );

}


// =========================
// INVOICE ERSTELLEN
// =========================

async function createInvoice(
    player,
    matchday
) {

    const photoInput =
        document.getElementById("playerPhoto");


    const photoFile =
        photoInput?.files[0];


    let photoPath = null;


    // =========================
    // FOTO HOCHLADEN
    // =========================

    if (photoFile) {

        const fileExtension =
            photoFile.name
                .split(".")
                .pop();


        const fileName =
            `${Date.now()}_${player.nummer}.${fileExtension}`;


        const {
            data: uploadData,
            error: uploadError
        } = await supabaseClient
            .storage
            .from("invoice-photos")
            .upload(
                fileName,
                photoFile
            );


        if (uploadError) {

            console.error(
                "Fehler beim Hochladen des Fotos:",
                uploadError
            );

            alert(
                "Das Foto konnte nicht hochgeladen werden."
            );

            return;
        }


        photoPath =
            uploadData.path;

    }


    // =========================
    // INVOICE ERSTELLEN
    // =========================

    const {
        data,
        error
    } = await supabaseClient
        .from("invoices")
        .insert({

            name: player.name,

            vorname: player.vorname,

            number: player.nummer,

            paid: false,

            time: new Date().toISOString(),

            gameday: matchday,

            photo: photoPath

        })
        .select();


    if (error) {

        console.error(
            "Fehler beim Erstellen der Invoice:",
            error
        );

        return;
    }


    console.log(
        "Invoice erstellt:",
        data
    );


    // Popup schließen

    selectedPlayer = null;


    document
        .getElementById("playerPopup")
        .classList.remove("show");

}


// =========================
// SUBMIT
// =========================

const submitPlayer =
    document.getElementById("submitPlayer");


if (submitPlayer) {

    submitPlayer.addEventListener(
        "click",
        async () => {

            if (!selectedPlayer) {
                return;
            }


            const matchday =
                document
                    .getElementById(
                        "matchdayCheckbox"
                    )
                    .checked;


            await createInvoice(
                selectedPlayer,
                matchday
            );

        }
    );

}


// =========================
// ABBRECHEN
// =========================

const cancelPlayerPopup =
    document.getElementById(
        "cancelPlayerPopup"
    );


if (cancelPlayerPopup) {

    cancelPlayerPopup.addEventListener(
        "click",
        () => {

            selectedPlayer = null;


            document
                .getElementById("playerPopup")
                .classList.remove("show");

        }
    );

}


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

        window.location.href =
            "players.html";

    } else {

        alert("Falsches Passwort.");

    }

}


// =========================
// MENÜ
// =========================

function menuFunction(x) {

    x.classList.toggle("change");


    document
        .getElementById("navLinks")
        .classList.toggle("show");

}


// =========================
// START
// =========================

getPlayers();