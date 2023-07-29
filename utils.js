function signIn(clientId,redirectUri,scopes,response_type="token") {
  let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  let form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);

  let params = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: response_type,
    scope: scopes,
    include_granted_scopes: "true",
    state: "pass-through-value",
  };

  for (var p in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  document.body.appendChild(form);

  form.submit();
}

function logout(access_token, redirect_url) {
  fetch("https://oauth2.googleapis.com/revoke?token=" + access_token, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
  }).then((data) => {
    location.href = redirect_url;
  });
}

function getParamsFromURL(url) {
  let params = {};

  let regex = /([^&=]+)=([^&]*)/g,
    m;

  while ((m = regex.exec(url))) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }

  return params;
}

function saveOAuth2Info(data, path, name) {
    if (Object.keys(data).length > 0) {
        localStorage.setItem(name, JSON.stringify(data))
    }

    // hide the access token

    window.history.pushState({}, document.title, "/" + path)

}

// Function to store the template document ID in the local storage
function setTemplateDocumentId(templateDocumentId) {
  localStorage.setItem("templateDocumentId", templateDocumentId);
}

// Example usage:
const templateDocumentId = '132dW6-cb5w1io1tB8qkc6W1wpA2xpEntugZezycyUa0';
setTemplateDocumentId(templateDocumentId);


export default{
    signIn,
    logout,
    saveOAuth2Info,
    getParamsFromURL
}
