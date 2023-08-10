import utils from './utils.js'


let CLIENT_ID = "200624216191-nujs4nugdo4171450bfmm55rk5fksdej.apps.googleusercontent.com"
let REDIRECT_URI = "https://bioanywhere.github.io/profile.html"
let SCOPES = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.external_request https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/script.scriptapp";

let button = document.getElementById('button')

button.addEventListener('click',signIn)


async function signIn() {
  await utils.signIn(CLIENT_ID, REDIRECT_URI, SCOPES);

}






