import utils from "./utils.js";

let params = utils.getParamsFromURL(location.href);
let ACCESS_TOKEN = "";
let redirect_url = "";

let button = document.getElementById("logout");

console.log(params);

utils.saveOAuth2Info(params, "/grist-widget/google/profile.html", "info");

let info = JSON.parse(localStorage.getItem("info"));
ACCESS_TOKEN = info.access_token

fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
})
  .then((data) => data.json())
  .then((info) => {
    console.log(info);
    document.getElementById("name").innerHTML += info.name;
    document.getElementById("image").setAttribute("src", info.picture);
  });

button.onclick = logout;

function logout() {
  utils.logout(ACCESS_TOKEN, redirect_url);
}
