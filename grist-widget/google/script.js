import utils from './utils.js'

let CLIENT_ID = "200624216191-au85bp336m9kj1vpfqajhogl0addg5he.apps.googleusercontent.com"
let REDIRECT_URI = "https://bioanywhere.github.io/grist-widget/google/profile.html"
let SCOPES = "https://www.googleapis.com/auth/userinfo.profile"

let button = document.getElementById('button')

button.addEventListener('click',signIn)

function signIn(){

utils.signIn(CLIENT_ID,REDIRECT_URI,SCOPES)

}