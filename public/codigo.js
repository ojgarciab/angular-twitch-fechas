
let token = false;
window.addEventListener("message", evento => {
    if (evento.origin == location.origin) {
        /* Cerramos la ventana de inicio de sesión */
        this.win.close();
        /* Guardamos las credenciales */
        token = evento.data.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1]
        localStorage.setItem('token', token);
        console.log(evento.data, token);
    }
}, false);



const boton_login = document.getElementById("login");

const idToken = "q5gn79f80294bvyb3fwwfb11uhe23w";
const redirect = "https://8001-f01d5132-7a01-4c8c-883b-11bdc7049c95.ws-eu03.gitpod.io/callback.html";
const scope = "openid channel_read";
let aleatorio = Math.random(0).toString(36).substr(2);;
console.log("Aleatorio: ", aleatorio);

boton_login.addEventListener("click", evento => {
    win = window.open(
        `https://id.twitch.tv/oauth2/authorize?client_id=${idToken}&redirect_uri=${redirect}&response_type=token&scope=${scope}&state=${aleatorio}`,
        'twitchLogin',
        "location=yes,height=620,width=520,scrollbars=no,resizable=no,status=yes"
    );
});

