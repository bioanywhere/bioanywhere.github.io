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


function flattenJson(data, prefix = '', result = []) {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof data[key] === 'object' && data[key] !== null) {
        flattenJson(data[key], newKey, result);
      } else {
        result.push({ Field: newKey, Value: data[key], Placeholder: `{{${newKey}}}` });
      }
    }
  }
  return result;
}

function convertJsonToDataFrame(jsonData) {
  // Fix the Report key, removing single quotes and adding escaped double quotes
  jsonData = jsonData.replace(/'/g, '"');

  // Parse the JSON into an object
  const data = JSON.parse(jsonData);

  // Extract the 'Report' value
  let reportData = JSON.parse(data['Report']);

  // Flatten the 'Report' object using the custom recursive function
  reportData = flattenJson(reportData);

  // Return the DataFrame-like array of objects
  return reportData;
}

// Example usage with the provided JSON data
const jsonData = '{"id":2,"Company":"Forward","Report":"{' + "'id': 2, 'Company': {'id': 1, 'Name': 'Forward', 'Date_Founded': 2007.0, 'Address': '', 'Phone_Number': 3008156298.0, 'Website': 'www.g-forward.com', 'Sector': null, 'Description': 'Software Development', 'Gross_Profit': 20.0, 'Revenue': 70.0, 'Gross_Profit_Margin': 28.57142857142857, 'Full_Time_Employees': 80.0, 'Part_Time_Employees': 20.0, 'Part_Time_Employee_Composition': 0.2, 'Number_of_Owners': 30.0, 'Women_Owners': 3.0, 'Women_Owners_Ratio': 0.1, 'Indigenous_Owners': 20.0, 'Indigenous_Owners_Ratio': 0.6666666666666666, 'Contact_Information': 'Pepe Mujica', 'Full_Time_Employee_Composition': 0.8, 'Governance': 'Governance[RecordList([2], group_by={' + "'Company': 1}, sort_by=None)], 'References': null, 'Business_Model': 'Business_Model[[1]]}, 'Governance': [{'id': 1, 'Purpose': 'No', 'Executive_Responsibilities': 'No', 'Stakeholder_Engagement': 'Partially', 'Strategic_Planning': 'Yes', 'Risk_Management_Process': 'Partially', 'Disclosures_Reports': 'Partially', 'Decision_Making': 'Yes', 'Research_and_Development': 'Partially', 'Competency_Maps': 'Yes', 'Executive_Compensation': 'No', 'Company': 'Companies[2]', 'Description': 'Consumer Insights', 'Sum_No': 3, 'Sum_Partially': 4, 'Sum_Yes': 3, 'Overall_Score': 0.5, 'Weight_No': 0, 'Weight_Yes': 10, 'Weight_Partially': 5}], 'Business_Model': [{'id': 2, 'Traditional_Flows': true, 'Nested_Interdependencies': false, 'Impact_Points': false, 'Value': false, 'Risks': true, 'Reputation': true, 'Company': 'Companies[2]', 'Score': 0.5}], 'Send_JSON': null, 'Transaction': null}","Governance":{"tableId":"Governance","rowIds":[1]},"Business_Model":{"tableId":"Business_Model","rowIds":[2]},"Send_JSON":null,"Transaction":null}';
const dataFrame = convertJsonToDataFrame(jsonData);
console.log(dataFrame);




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

// Event listener for the "Create Report" button
document.getElementById('Report').addEventListener('click', async () => {
  // ... (Previous code)

  try {
    // Step 1: Duplicate the template document
    // ... (Previous code)

    // Step 2: Convert JSON to DataFrame-like array of objects
    console.log("Step 2: Converting JSON to DataFrame-like array of objects...");
    const jsonData = '{"id":2,"Company":"Forward","Report":"{' + "'id': 2, 'Company': {'id': 1, 'Name': 'Forward', ..."; // Your JSON data here
    const dataFrame = convertJsonToDataFrame(jsonData);
    console.log("DataFrame:", dataFrame);

    // Step 3: Retrieve the content of the duplicated document
    console.log("Step 3: Retrieving the content of the duplicated document...");
    const contentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${duplicateData.id}?alt=media`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const contentText = await contentResponse.text();
    console.log("Step 3: Retrieved document content.");

    // Step 4: Replace Placeholders with Values from DataFrame
    console.log("Step 4: Replacing Placeholders with Values...");
    let updatedContent = contentText;
    for (const row of dataFrame) {
      updatedContent = updatedContent.replace(new RegExp(row.Placeholder, 'g'), row.Value);
    }
    console.log("Step 4: Placeholders replaced with Values.");

    // Step 5: Upload the modified content back to the document
    console.log("Step 5: Uploading the modified content to the document...");
    const updatedContentBlob = new Blob([updatedContent], { type: 'application/vnd.google-apps.document' });

    try {
      // Send the PATCH request to update the file content
      // ... (Previous code for sending PATCH request)

      console.log("Step 5: Document content updated successfully.");
      debugger;
      // Step 6: Return the URL of the modified document
      const documentUrl = `https://docs.google.com/document/d/${duplicateData.id}`;
      console.log("Step 6: Document URL:", documentUrl);
      debugger;
      window.location.href = documentUrl;
    } catch (error) {
      console.error('Error updating the document content:', error);
      alert('Failed to update the document content. Please try again later.');
    }

  } catch (error) {
    console.error('Error creating the report:', error);
    alert('Failed to create the report. Please try again later.');
  }
});