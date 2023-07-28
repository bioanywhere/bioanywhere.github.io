// profile.js
import utils from "./utils.js";

let params = utils.getParamsFromURL(location.href);
let redirect_url = "";

console.log("params:", params);

utils.saveOAuth2Info(params, "profile.html", "info");

fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  headers: {
    Authorization: `Bearer ${params.access_token}`,
  },
})
  .then((data) => data.json())
  .then((info) => {
    console.log("User Info:", info);
    document.getElementById("name").innerHTML += info.name;
    document.getElementById("image").setAttribute("src", info.picture);

    // Proceed with the "Create Report" button event handling
    let button = document.getElementById("Report");
    button.onclick = async () => {
      // Retrieve the access_token and json_data from the local storage
      const access_token = JSON.parse(localStorage.getItem("info")).access_token;
      const json_data = JSON.parse(localStorage.getItem("json_data"));

      console.log("Access Token:", access_token);
      console.log("JSON Data:", json_data);

      try {
        // Call the function to upload the document to Google Drive
        const documentUrl = await uploadToGoogleDrive(access_token, json_data);

        // Step 4: Redirect the user to the new document after clicking on the "Create Report" button
        if (documentUrl) {
          console.log("Step 4: Redirecting to the new document:", documentUrl);
          window.location.href = documentUrl;
        } else {
          alert('Failed to create the report. Please try again later.');
        }
      } catch (error) {
        console.error('Error creating the report:', error);
        alert('Failed to create the report. Please try again later.');
      }
    };
  })
  .catch((error) => {
    console.error("Error fetching user info:", error);
  });

// Function to upload the document to Google Drive using Google Drive API
async function uploadToGoogleDrive(access_token, json_data) {
  try {
    const createFileResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'New Document', // Set the name of the new document
        mimeType: 'application/vnd.google-apps.document'
      })
    });

    const responseData = await createFileResponse.json();
    console.log("Step 1: Response data:", responseData);

    if (responseData.id) {
      const documentId = responseData.id;
      console.log("Step 2: Inserting json_data in the new document...");
      const importResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${documentId}/import`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data)
      });

      const importResponseData = await importResponse.json();
      console.log("Step 2: Import Response data:", importResponseData);

      // Step 3: Return the URL of the new document just created
      const documentUrl = `https://docs.google.com/document/d/${documentId}`;
      console.log("Step 3: Document URL:", documentUrl);
      return documentUrl;
    } else {
      throw new Error('Failed to create a new document.');
    }
  } catch (error) {
    console.error('Error creating the report:', error);
    throw error;
  }
}
