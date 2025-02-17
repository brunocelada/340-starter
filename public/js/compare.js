"use strict";
// ENHANCEMENT <----------------------------------------------------------------

// Selectors and EventListeners
let classificationList1 = document.querySelector("#classificationList1");
let classificationList2 = document.querySelector("#classificationList2");

let vehicleList1 = document.querySelector("#vehicleList1");
let vehicleList2 = document.querySelector("#vehicleList2");

let vehicleTable1 = document.querySelector("#vehicleTable1")
let vehicleTable2 = document.querySelector("#vehicleTable2")

classificationList1.addEventListener("change", () => getInvIdList(classificationList1, vehicleList1)); 
classificationList2.addEventListener("change", () => getInvIdList(classificationList2, vehicleList2));

vehicleList1.addEventListener("change", () => getInvIdData(vehicleList1, vehicleTable1)); 
vehicleList2.addEventListener("change", () => getInvIdData(vehicleList2, vehicleTable2));


// Activate the Vehicle list, based on the classification selected value
function activateVehicleLists (classificationList, vehicleList, vehicleTable) {
  if (classificationList.value) {
    vehicleList.disabled = false;
    if (vehicleList.value) {
      getInvIdData(vehicleList, vehicleTable)
    }
  } else {
    vehicleList.disabled = true;
  }
};
activateVehicleLists(classificationList1, vehicleList1, vehicleTable1);
activateVehicleLists(classificationList2, vehicleList2, vehicleTable2);

// Get a list of items in inventory based on the classification_id
function getInvIdList(classificationList, vehicleList) {
  activateVehicleLists(classificationList, vehicleList);

  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);
  let compareIdURL = "/inv/getInventory/" + classification_id;
  fetch(compareIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      buildInventoryList(data, vehicleList);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
};

// Build inventory items list into HTML table components and inject into DOM 
function buildInventoryList(data, vehicleList) {
  let vehicleId = vehicleList.value;
  if (vehicleId != null) {
    // Remove the old options
    vehicleList.textContent = "";

    // Create the first option
    let option = document.createElement("option");
    option.textContent = "Choose a Vehicle"
    vehicleList.appendChild(option);

    // Add the vehicle options
    data.forEach(function (vehicle) {
      let option = document.createElement("option");
      console.log(vehicle.inv_id + ", " + vehicle.inv_model); 
      option.value = vehicle.inv_id;
      option.textContent = `${vehicle.inv_make} ${vehicle.inv_model}`;
      vehicleList.appendChild(option);
    });
  }
}

// Get a vehicle data based on the inv_id
function getInvIdData(vehicleList, vehicleTable) {
  let vehicle_id = vehicleList.value;
  console.log(`vehicle_id is: ${vehicle_id}`);
  let compareIdURL = "/inv/getVehicle/" + vehicle_id;
  fetch(compareIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildInventoryData(data, vehicleTable);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
};

// Build inventory items data into HTML table components and inject into DOM 
function buildInventoryData(element, tableName) {
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += `<tr><th>"${element.inv_make} ${element.inv_model}"</th></tr>`;
    dataTable += `<tr><th id="th-img"><img src="${element.inv_thumbnail}" alt="Image of ${element.inv_make} ${element.inv_model} on CSE Motors"></th></tr>`;
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>';
    dataTable += `<tr><td><strong>Year:</strong> ${element.inv_year}</td>`;
    dataTable += `<tr><td><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(element.inv_price)}</td>`;
    dataTable += `<tr><td><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(element.inv_miles)}</td>`;
    dataTable += `<tr><td><strong>Color:</strong> ${element.inv_color}</td>`;
    dataTable += `<tr><td><strong>Description:</strong> ${element.inv_description}</td>`;
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    tableName.innerHTML = dataTable; 
}