/* Acceso a los elementos de trabajo */
const boton_login = document.getElementById("login");
const tabla_cuerpo = document.querySelector("#tabla tbody");

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
        twitch_id = respuesta.data[0].id;
    })
    .catch((respuesta, error) => {
        /* En caso de error mostramos la información necesaria */
        console.log(respuesta, error);
    });
}

function obtener_videos() {
    if (videos !== null) {
        mostrar_videos();
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
        videos = respuesta.data;
        mostrar_videos();
    })
    .catch((respuesta, error) => {
        /* En caso de error mostramos la información necesaria */
        console.log(respuesta, error);
    });
}

function mostrar_videos() {
    if (videos === null) {
        return;
    }
    console.log("Mostrando vídeos");
    while ((hijo = tabla_cuerpo.firstChild) !== null) {
        tabla_cuerpo.removeChild(hijo);
    }
    videos.forEach(video => {
        let linea = document.createElement("tr");
        let num = document.createElement("th");
        let nombre = document.createElement("td");
        let fecha = document.createElement("td");
        let accion = document.createElement("td");
        let boton = document.createElement("button");
        boton.addEventListener("click", actualizar_video);
        num.innerText = video.id;
        nombre.innerText = video.title;
        fecha.innerText = video.published_at;
        boton.dataset.id = video.id;
        boton.innerText = "Actualizar";
        accion.appendChild(boton);
        linea.appendChild(num);
        linea.appendChild(nombre);
        linea.appendChild(fecha);
        linea.appendChild(accion);
        tabla_cuerpo.appendChild(linea);
        console.log(video);
    });
}

function actualizar_video(e) {
    const video = videos.filter(video => video.id == e.target.dataset.id);
    if (video.length === 0) {
        return;
    }
    console.log(video[0]);
    let titulo = video[0].title;
    titulo = video[0].published_at.replace("T", " ").substr(0, 16) + " " + titulo;
    console.log("Nuevo título: ", titulo);
    var url = new URL("https://api.twitch.tv/kraken/videos/" + e.target.dataset.id);
    url.searchParams.append("title", titulo);
    console.log("URL de la llamada al API: ", url.href);
    console.log(video);
    fetch(
        url.href,
        {
            method: 'PUT',
            headers: {
                "Accept": "application/vnd.twitchtv.v5+json",
                "Authorization": "OAuth " + token
            }
        }
    )
    .then(respuesta => respuesta.json())
    .then(respuesta => {
        /* Mostramos por consola la salida */
        console.log("Respuesta recibida: ", respuesta);
        videos = null;
        obtener_videos();
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

