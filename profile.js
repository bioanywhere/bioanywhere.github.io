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
  //const json_data = JSON.parse(localStorage.getItem("json_data"));

    const json_data = {
    "id": 2,
    "Company": "Forward",
    "Report": "{\"id\": 2, \"Company\": {\"id\": 1, \"Name\": \"Forward\", \"Date_Founded\": 2007.0, \"Address\": \"\", \"Phone_Number\": 3008156298.0, \"Website\": \"www.g-forward.com\", \"Sector\": null, \"Description\": \"Software Development\", \"Gross_Profit\": 20.0, \"Revenue\": 70.0, \"Gross_Profit_Margin\": 28.57142857142857, \"Full_Time_Employees\": 80.0, \"Part_Time_Employees\": 20.0, \"Part_Time_Employee_Composition\": 0.2, \"Number_of_Owners\": 30.0, \"Women_Owners\": 3.0, \"Women_Owners_Ratio\": 0.1, \"Indigenous_Owners\": 20.0, \"Indigenous_Owners_Ratio\": 0.6666666666666666, \"Contact_Information\": \"Pepe Mujica\", \"Full_Time_Employee_Composition\": 0.8, \"Governance\": {\"tableId\":\"Governance\",\"rowIds\":[2]}, \"References\": null, \"Business_Model\": {\"tableId\":\"Business_Model\",\"rowIds\":[1]}}, \"Governance\": [{\"id\": 1, \"Purpose\": \"No\", \"Executive_Responsibilities\": \"No\", \"Stakeholder_Engagement\": \"Partially\", \"Strategic_Planning\": \"Yes\", \"Risk_Management_Process\": \"Partially\", \"Disclosures_Reports\": \"Partially\", \"Decision_Making\": \"Yes\", \"Research_and_Development\": \"Partially\", \"Competency_Maps\": \"Yes\", \"Executive_Compensation\": \"No\", \"Company\": {\"tableId\":\"Companies\",\"rowIds\":[2]}, \"Description\": \"Consumer Insights\", \"Sum_No\": 3, \"Sum_Partially\": 4, \"Sum_Yes\": 3, \"Overall_Score\": 0.5, \"Weight_No\": 0, \"Weight_Yes\": 10, \"Weight_Partially\": 5}], \"Business_Model\": [{\"id\": 2, \"Traditional_Flows\": true, \"Nested_Interdependencies\": false, \"Impact_Points\": false, \"Value\": false, \"Risks\": true, \"Reputation\": true, \"Company\": {\"tableId\":\"Companies\",\"rowIds\":[2]}, \"Score\": 0.5}], \"Send_JSON\": null, \"Transaction\": null}",
    "Governance": {"tableId":"Governance","rowIds":[1]},
    "Business_Model": {"tableId":"Business_Model","rowIds":[2]},
    "Send_JSON":null,
    "Transaction":null
  };

  // Check if json_data exists
  if (!json_data) {
    console.error("JSON data not found in local storage.");
    return;
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

    // Step 3: Use the Google Docs API to replace placeholders
    const placeholders = findPlaceholders(duplicateData.id);

    if (placeholders && placeholders.length > 0) {
      console.log("Step 3: Replacing placeholders...");

      const replaceRequests = placeholders.map((placeholder) => {
        return {
          replaceAllText: {
            containsText: {
              text: `{{${placeholder}}}`,
              matchCase: false,
            },
            replaceText: json_data[placeholder] || '',
          },
        };
      });

      const googleDocsApiUrl = `https://docs.googleapis.com/v1/documents/${duplicateData.id}:batchUpdate`;
      const googleDocsApiHeaders = {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      };

      try {
        const replaceResponse = await fetch(googleDocsApiUrl, {
          method: 'POST',
          headers: googleDocsApiHeaders,
          body: JSON.stringify({
            requests: replaceRequests,
          }),
        });

        const replaceResponseData = await replaceResponse.json();
        console.log("Step 3: Placeholders replaced.");
        console.log("Replace Response Data:", replaceResponseData);

        // Step 4: Return the URL of the modified document
        const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
        console.log("Step 4: Document URL:", documentUrl);
        debugger;
        window.location.href = documentUrl;
      } catch (error) {
        console.error('Error replacing placeholders:', error);
        alert('Failed to replace placeholders. Please try again later.');
      }
    } else {
      console.log("Step 3: No placeholders found in the document.");
      // Step 4: Return the URL of the duplicated document without any replacements
      const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
      console.log("Step 4: Document URL:", documentUrl);
      debugger;
      window.location.href = documentUrl;
    }

  } catch (error) {
    console.error('Error creating the report:', error);
    alert('Failed to create the report. Please try again later.');
  }
});

// Function to find placeholders in the document content
async function findPlaceholders(documentId) {
  const googleDocsApiUrl = `https://docs.googleapis.com/v1/documents/${documentId}`;
  const googleDocsApiHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const documentResponse = await fetch(googleDocsApiUrl, {
      headers: googleDocsApiHeaders,
    });

    const documentData = await documentResponse.json();
    const documentContent = documentData.body.content;
    const placeholders = [];

    if (documentContent) {
      processContent(documentContent, placeholders);
      return placeholders;
    } else {
      console.error("Document content not found.");
      return null;
    }
  } catch (error) {
    console.error('Error retrieving the document:', error);
    return null;
  }
}

// Function to recursively process document content and find placeholders
function processContent(content, placeholders) {
  for (const element of content) {
    if (element.hasOwnProperty('paragraph')) {
      // Process paragraphs
      for (const paragraphElement of element.paragraph.elements) {
        processContent(paragraphElement, placeholders);
      }
    } else if (element.hasOwnProperty('textRun')) {
      // Process textRuns
      if (element.textRun.hasOwnProperty('content')) {
        const text = element.textRun.content;
        if (text.includes('{{') && text.includes('}}')) {
          // Extract and store placeholders from the text
          const placeholderKeys = text.match(/{{(.*?)}}/g);
          if (placeholderKeys) {
            for (const placeholderKey of placeholderKeys) {
              const placeholderName = placeholderKey.replace(/[{}]/g, '');
              if (!placeholders.includes(placeholderName)) {
                placeholders.push(placeholderName);
              }
            }
          }
        }
      }
    }
  }
}
