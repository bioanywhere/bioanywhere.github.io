import utils from "./utils.js";

// Function to get nested properties from an object based on a dot-separated string
function getNestedProperty(obj, propString) {
  const props = propString.split('.');
  let value = obj;
  for (const prop of props) {
    if (value.hasOwnProperty(prop)) {
      value = value[prop];
    } else {
      return undefined; // Return undefined if the property doesn't exist
    }
  }
  return value;
}

// Function to create the multipart request body with metadata and JSON content
utils.createMultipartRequestBody = (json_data) => {
  // Define the metadata for the file (change as needed)
  const metadata = {
    name: "My Report", // The name of the file
    mimeType: "application/vnd.google-apps.document", // MIME type for Google Docs document
  };

  // Create the multipart request body
  const boundary = "-------" + Date.now();
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // Construct the metadata part of the request
  let requestBody = delimiter;
  requestBody += `Content-Type: application/json; charset=UTF-8\r\n\r\n`;
  requestBody += JSON.stringify(metadata);

  // Add the JSON content part of the request
  requestBody += delimiter;
  requestBody += `Content-Type: application/json\r\n\r\n`;
  requestBody += JSON.stringify(json_data);

  // Add the closing boundary
  requestBody += closeDelimiter;

  return requestBody;
};

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
  })
  .catch((error) => {
    console.error("Error fetching user info:", error);
  });

// ... (previous code)

// ... (Rest of the code)

// Event listener for the "Create Report" button
document.getElementById('Report').addEventListener('click', async () => {
  console.log("Button clicked.");
  // Retrieve the access_token from the local storage
  const access_token = JSON.parse(localStorage.getItem("info")).access_token;
  console.log("Access Token:", access_token);

  // Retrieve the JSON data from the local storage
  const json_data = JSON.parse(localStorage.getItem("json_data"));

  // Check if json_data exists
  if (!json_data) {
    console.error("JSON data not found in local storage.");
  } else {
    // Print the JSON data in the console
    console.log("JSON data*:", json_data);
  }

  // Function to store the template document ID in the local storage
  function setTemplateDocumentId(templateDocumentId) {
    localStorage.setItem("templateDocumentId", templateDocumentId);
  }

  const templateDocumentId = '132dW6-cb5w1io1tB8qkc6W1wpA2xpEntugZezycyUa0';
  setTemplateDocumentId(templateDocumentId);
  console.log("Template Document ID:", templateDocumentId);

  try {
    // Step 1: Duplicate the template document
    console.log("Step 1: Duplicating the template document...");
    const duplicateResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${templateDocumentId}/copy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "My Report", // The name of the duplicated file
      }),
    });

    const duplicateData = await duplicateResponse.json();
    console.log("Step 1: Duplicated document ID:", duplicateData.id);

    console.log("Step 2: Document content duplicated successfully.");

    // Step 3: Use the Google Docs API to insert additional text
    console.log("Step 3: Inserting additional text into the document...");
    const additionalText = "This is the additional text you want to add.";

    const insertTextRequest = {
      insertText: {
        location: {
          index: 1, // Index where you want to insert the text. 1 represents right after the title of the document.
        },
        text: additionalText,
      },
    };

    const googleDocsApiUrl = `https://docs.googleapis.com/v1/documents/${duplicateData.id}:batchUpdate`;
    const googleDocsApiHeaders = {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    };

    try {
      const insertTextResponse = await fetch(googleDocsApiUrl, {
        method: 'POST',
        headers: googleDocsApiHeaders,
        body: JSON.stringify({
          requests: [insertTextRequest],
        }),
      });

      const insertTextResponseData = await insertTextResponse.json();
      console.log("Step 3: Additional text inserted into the document.");
      console.log("Insert Text Response Data:", insertTextResponseData);

      // Step 4: Return the URL of the modified document
      const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
      console.log("Step 4: Document URL:", documentUrl);
      debugger;
      window.location.href = documentUrl;
    } catch (error) {
      console.error('Error inserting additional text:', error);
      alert('Failed to insert additional text. Please try again later.');
    }

  } catch (error) {
    console.error('Error creating the report:', error);
    alert('Failed to create the report. Please try again later.');
  }
});
