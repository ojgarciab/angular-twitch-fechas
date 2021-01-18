/* Acceso a los elementos de trabajo */
const boton_login = document.getElementById("login");

/* Cargamos el token desde el almacenamiento del navegador */
let token = localStorage.getItem("token");
console.log("Cargado token almacenado: ", token);
let twitch_id = localStorage.getItem("twitch_id");
console.log("Cargado ID Twitch almacenado: ", twitch_id);
let videos = JSON.parse(localStorage.getItem("videos"));
console.log("Cargado listado de vídeos almacenados: ", videos);

function obtener_twitch_id() {
    if (twitch_id !== null) {
        obtener_videos();
        return;
    }
    fetch(
        "https://api.twitch.tv/helix/users",
        {
            "headers": {
                "Client-ID": clientId,
                "Authorization": "Bearer " + token
            }
        }
    )
    .then(respuesta => respuesta.json())
    .then(respuesta => {
        /* Mostramos por consola la salida */
        console.log("Respuesta recibida: ", respuesta);
        localStorage.setItem('twitch_id', respuesta.data[0].id);
        console.log("Almacenando ID Twitch: ", respuesta.data[0].id);
        obtener_videos();
    })
    .catch((respuesta, error) => {
        /* En caso de error mostramos la información necesaria */
        console.log(respuesta, error);
    });
}

function obtener_videos() {
    if (videos !== null) {
        return;
    }
    var url = new URL("https://api.twitch.tv/helix/videos");
    url.searchParams.append("user_id", twitch_id);
    url.searchParams.append("first", 100);
    console.log("URL de la llamada al API: ", url.href);
    fetch(
        url.href,
        {
            "headers": {
                "Client-ID": clientId,
                "Authorization": "Bearer " + token
            }
        }
    )
    .then(respuesta => respuesta.json())
    .then(respuesta => {
        /* Mostramos por consola la salida */
        console.log("Respuesta recibida: ", respuesta);
        localStorage.setItem('videos', JSON.stringify(respuesta.data));
        console.log("Almacenando videos: ", respuesta.data);
    })
    .catch((respuesta, error) => {
        /* En caso de error mostramos la información necesaria */
        console.log(respuesta, error);
    });
}

/* Prueba de funcionalidad del API */
function twitch_test() {
    fetch(
        "https://api.twitch.tv/kraken",
        {
            "headers": {
                "Accept": "application/vnd.twitchtv.v5+json",
                "Authorization": "OAuth " + token
            }
        }
    )
    .then(respuesta => respuesta.json())
    .then(respuesta => {
        /* Mostramos por consola la salida */
        console.log("Respuesta recibida: ", respuesta);
    })
    .catch((respuesta, error) => {
        /* En caso de error mostramos la información necesaria */
        console.log(respuesta, error);
    });
    
}

/* Si tenemos token de acceso ocultamos el botón */
if (token !== null) {
    boton_login.style.display = "none";
    /* Lanzamos una petición para comprobar la validez del token */
    twitch_test();
    obtener_twitch_id();
}

/* Funcionalidad de comunicación con la ventana de inicio de sesión */
let win = false;
window.addEventListener("message", evento => {
    if (evento.origin == location.origin) {
        /* Cerramos la ventana de inicio de sesión */
        if (win !== false) {
            win.close();
        }
        /* Guardamos las credenciales */
        token = evento.data.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1]
        localStorage.setItem('token', token);
        console.log("Almacenando token: ", token);
    }
}, false);

/* Preparamos la funcionalidad de inicio de sesión */
const scope = "openid channel_read channel_editor";
let aleatorio = Math.random(0).toString(36).substr(2);;
console.log("Aleatorio: ", aleatorio);

boton_login.addEventListener("click", evento => {
    win = window.open(
        `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect}&response_type=token&scope=${scope}&state=${aleatorio}`,
        'twitchLogin',
        "location=yes,height=620,width=520,scrollbars=no,resizable=no,status=yes"
    );
});

