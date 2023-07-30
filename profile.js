// Import utils.js
import utils from "./utils.js";

// Function to get the nested properties of the JSON data
function getNestedProperty(obj, path) {
  const keys = path.split('.');
  let value = obj;

  for (const key of keys) {
    if (value && value.hasOwnProperty(key)) {
      value = value[key];
    } else {
      value = undefined;
      break;
    }
  }

  return value;
}

// Function to replace variables in the content using the provided JSON data
function replaceVariables(jsonData, documentId) {
  const requests = [];
  const keys = Object.keys(jsonData);

  for (const key of keys) {
    const value = getNestedProperty(jsonData, key);
    requests.push({
      replaceAllText: {
        containsText: {
          text: `{{${key}}}`,
          matchCase: false,
        },
        replaceText: value !== undefined ? value.toString() : "",
      },
    });
  }

  return {
    requests: requests,
  };
}

// Function to update the content of the Google Docs document
async function updateDocumentContent(documentId, accessToken, content) {
  await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  });
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

// Fetch user info
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

// Event listener for the "Create Report" button
document.getElementById('Report').addEventListener('click', async () => {
  // Retrieve the access_token and json_data from the local storage
  const access_token = JSON.parse(localStorage.getItem("info")).access_token;
  const json_data = JSON.parse(localStorage.getItem("json_data"));

  // Retrieve the template document ID from the local storage
  const templateDocumentId = localStorage.getItem("templateDocumentId");

  console.log("Access Token:", access_token);
  console.log("JSON Data:", json_data);
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

    // Step 2: Retrieve the content of the duplicated document
    console.log("Step 2: Retrieving the content of the duplicated document...");
    const contentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${duplicateData.id}/export?mimeType=application/vnd.openxmlformats-officedocument.wordprocessingml.document`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const contentBlob = await contentResponse.blob();
    console.log("Step 2: Retrieved document content.");

    // Step 3: Read the content of the duplicated document as text
    console.log("Step 3: Reading the content of the duplicated document as text...");
    const contentText = await contentBlob.text();
    console.log("Step 3: Document content as text:", contentText);

    // Step 4: Replace the variables in the content with JSON data
    console.log("Step 4: Replacing variables in the document content...");
    const replacedContent = contentText.replace(/\{\{(.+?)\}\}/g, (match, variableName) => replaceVariables(json_data, variableName));
    console.log("Step 4: Variables replaced in the document content.");

    // Step 5: Upload the modified content back to the document
    console.log("Step 5: Uploading the modified content to the document...");
    const updatedContentBlob = new Blob([replacedContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    // Send the PATCH request to update the file content
    await updateDocumentContent(duplicateData.id, access_token, { requests: [{ replaceAllText: { containsText: { text: `{{Company.Name}}`, matchCase: false }, replaceText: 'Replaced Company Name' } }] });

    console.log("Step 5: Document content updated successfully.");

    // Step 6: Return the URL of the modified document
    const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
    console.log("Step 6: Document URL:", documentUrl);
    window.location.href = documentUrl;

    // Step 7: Get information about the new document
    try {
      console.log("Step 7: Getting information about the new document...");
      const newDocumentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${duplicateData.id}?fields=id,name,createdTime,modifiedTime,webViewLink`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!newDocumentResponse.ok) {
        throw new Error("Failed to get information about the new document.");
      }

      const newDocumentData = await newDocumentResponse.json();
      console.log("Step 7: Information about the new document:");
      console.log("Document ID:", newDocumentData.id);
      console.log("Document Name:", newDocumentData.name);
      console.log("Created Time:", newDocumentData.createdTime);
      console.log("Modified Time:", newDocumentData.modifiedTime);
      console.log("Web View Link:", newDocumentData.webViewLink);
    } catch (error) {
      console.error("Error getting information about the new document:", error);
      alert("Failed to get information about the new document. Please check the console for details.");
    }
  } catch (error) {
    console.error('Error creating the report:', error);
    alert('Failed to create the report. Please try again later.');
  }
});
