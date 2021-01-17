/* Funcionalidad de comunicación con la ventana de inicio de sesión */
let token = false;
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
        console.log(evento.data, token);
    }
}, false);

/* Preparamos la funcionalidad de inicio de sesión */
const boton_login = document.getElementById("login");

const scope = "openid channel_read";
let aleatorio = Math.random(0).toString(36).substr(2);;
console.log("Aleatorio: ", aleatorio);

boton_login.addEventListener("click", evento => {
    win = window.open(
        `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect}&response_type=token&scope=${scope}&state=${aleatorio}`,
        'twitchLogin',
        "location=yes,height=620,width=520,scrollbars=no,resizable=no,status=yes"
    );
});

