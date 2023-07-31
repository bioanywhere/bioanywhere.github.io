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

// Function to make a fetch request and log the request and response
async function makeFetchRequest(url, options) {
  console.log("Making request:", url);
  console.log("Request Options:", options);

  try {
    const response = await fetch(url, options);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error('Error making the request:', error);
    throw error;
  }
}

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



// ... (Rest of the code)


// Helper function to convert the value to a string and handle special characters
function convertValueToString(value) {
  if (typeof value === "string") {
    // If the value is already a string, return it as is
    return value;
  } else if (typeof value === "number") {
    // If the value is a number, convert it to a string
    return value.toString();
  } else {
    // For other data types (e.g., boolean, null), handle them accordingly
    return value ? "true" : "false"; // Convert boolean to "true" or "false"
    // Handle null or other data types as needed
  }
}


// Helper function to flatten the nested JSON and create placeholders
function flattenJson(data, prefix = '') {
  let items = [];
  for (let key in data) {
    if (typeof data[key] === 'object' && data[key] !== null) {
      items = items.concat(flattenJson(data[key], prefix ? prefix + '.' + key : key));
    } else {
      const placeholder = `{{${prefix ? prefix + '.' + key : key}}}`; // Create separate placeholders for each key
      items.push({ Placeholder: placeholder, Value: data[key] });
    }
  }
  return items;
}


// Event listener for the "Create Report" button
document.getElementById('Report').addEventListener('click', async () => {
  console.log("Button clicked.");
  // Retrieve the access_token from the local storage
  const access_token = JSON.parse(localStorage.getItem("info")).access_token;
  console.log("Access Token:", access_token);

  // Retrieve the JSON data from the local storage
  const jsonData = JSON.parse(localStorage.getItem("json_data"));

  // Helper function to flatten the nested JSON
  function flattenJson(data, prefix = '') {
    let items = [];
    for (let key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        items = items.concat(flattenJson(data[key], prefix ? prefix + '.' + key : key));
      } else {
        items.push([prefix ? prefix + '.' + key : key, data[key]]);
      }
    }
    return items;
  }

  // Flatten the JSON
  const flattenedData = flattenJson(jsonData);

  // Convert flattened data to DataFrame format
  const df = flattenedData.map(item => {
    return { 'Field': item[0], 'Value': item[1], 'Placeholder': `{{${item[0]}}}` };
  });

  // Display the DataFrame
  console.log(df);

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
    const duplicateResponse = await makeFetchRequest(`https://www.googleapis.com/drive/v3/files/${templateDocumentId}/copy`, {
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

    // Step 3: Use the Google Docs API to replace placeholders with DataFrame values
    console.log("Step 3: Replacing placeholders with DataFrame values...");

    // Flatten the nested JSON and create placeholders
    const flattenedData = flattenJson(jsonData);

    // Convert flattened data to DataFrame format (Optional: Use this DataFrame for other purposes)
    const df = flattenedData.map(item => {
      return { 'Placeholder': item.Placeholder, 'Value': item.Value };
    });

    // Perform nested replacements for each sub-element
    for (const item of flattenedData) {
      const batchUpdateResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${duplicateData.id}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              replaceAllText: {
                containsText: {
                  text: item.Placeholder,
                  matchCase: false,
                },
                replaceText: JSON.stringify(item.Value), // Properly escape the value
              },
            },
          ],
        }),
      });

      const batchUpdateResponseData = await batchUpdateResponse.json();
      console.log(`Replaced Placeholder: ${item.Placeholder}`);
      console.log("Batch Update Response Data:", batchUpdateResponseData);
    
      // Function to print all the valid placeholders from the JSON data
      function printValidPlaceholders(data, prefix = '') {
        for (let key in data) {
          if (typeof data[key] === 'object' && data[key] !== null) {
            printValidPlaceholders(data[key], prefix ? prefix + '.' + key : key);
          } else {
            const placeholder = `{{${prefix ? prefix + '.' + key : key}}}`;
            console.log(`Valid Placeholder: ${placeholder}`);
          }
        }
      }

      // Print all the valid placeholders from the JSON data
      console.log("Valid Placeholders:");
      printValidPlaceholders(jsonData);

      // Step 4: Return the URL of the modified document
      const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
      console.log("Step 4: Document URL:", documentUrl);
      debugger;
      window.location.href = documentUrl;
    } catch (error) {
      console.error('Error replacing placeholders:', error);
      alert('Failed to replace placeholders. Please try again later.');
    }

  } catch (error) {
    console.error('Error creating the report:', error);
    alert('Failed to create the report. Please try again later.');
  }
});