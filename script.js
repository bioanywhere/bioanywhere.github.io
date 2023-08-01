import utils from './utils.js'

let CLIENT_ID = "200624216191-nujs4nugdo4171450bfmm55rk5fksdej.apps.googleusercontent.com"
let REDIRECT_URI = "https://bioanywhere.github.io/profile.html"
let SCOPES = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file";

let button = document.getElementById('button')

button.addEventListener('click',signIn)

function signIn(){

utils.signIn(CLIENT_ID,REDIRECT_URI,SCOPES)

}

let logoutButton = document.getElementById('logout'); // Get the logout button from the profile.html file

logoutButton.addEventListener('click', logoutAction);

function logoutAction() {
  let oAuth2Data = JSON.parse(localStorage.getItem('oauth2')); // Assuming the OAuth2 data is stored in localStorage with the key 'oauth2'
  let access_token = oAuth2Data.access_token;
  let redirect_url = "https://bioanywhere.github.io/index.html"; // Replace with the URL to which you want to redirect after logout

  utils.logout(access_token, redirect_url);
}