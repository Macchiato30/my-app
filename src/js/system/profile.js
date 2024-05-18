import {
  supabase,
  successNotification,
  errorNotification,
  doLogout,
} from "../main";

// Assign Logout Functionality
const btn_signout = document.getElementById("btn_signout");

btn_signout.onclick = doLogout;

// Load data
getDatas();

const form_service = document.getElementById("form_service");

form_service.onsubmit = async (e) => {
  e.preventDefault();

  // Get all values from input, textarea under forms
  const formData = new FormData(form_service);

  if (for_update_id == "") {
    // Input Data into supabase
    const { data, error } = await supabase
      .from("service")
      .insert([
        {
          service_name: formData.get("service_name"),
          hourly_rate: formData.get("hourly_rate"),
          description: formData.get("description"),
          image_path: formData.get("image_path"),
        },
      ])
      .select();

    if (error == null) {
      // Show Notification
      successNotification("Service Successfully Uploaded!", 15);

      // Modal close
      document.getElementById("modal_close").click();
      // Reload datas
      getDatas();
    } else {
      errorNotification("Something went wrong. Service not uploaded!", 10);
      console.log(error);
    }
  } else {
    const { data, error } = await supabase
      .from("service")
      .update({
        service_name: formData.get("service_name"),
        hourly_rate: formData.get("hourly_rate"),
        description: formData.get("description"),
        image_path: formData.get("image_path"),
      })
      .eq("id", for_update_id)
      .select();

    if (error == null) {
      // Show Notification
      successNotification("Service Successfully Updated!", 15);

      // reset storage id
      for_update_id = "";

      // Reload datas
      getDatas();
    } else {
      errorNotification("Something went wrong. Service not updated!", 10);
      console.log(error);
    }
  }

  // Modal close
  document.getElementById("modal_close").click();

  // Reset Form
  form_service.reset();

  // Enable Submit Button
  document.querySelector(
    "#form_service button[type='submit']"
  ).disabled = false;
  document.querySelector(
    "#form_service button[type='submit']"
  ).innerHTML = `Upload`;
};

async function getDatas() {
  // Get all rows of tables
  let { data: services, error } = await supabase.from("service").select("*");

  let container = "";
  // Get Each service and interpolate with HTML elements
  services.forEach((service) => {
    container += `<div class="col-sm-12">
      <div class="card w-100 mt-3" data-id="${service.id}">
  
          <div class="row">
              <div class="col-sm-4">
                  <img src="${service.image_path}" width="100%" height="225px">
              </div>
  
              <div class="col-sm-8">
                  <div class="card-body">
              
                      <div class="dropdown float-end">
                          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                          <ul class="dropdown-menu">
                              <li>
                                  <a class="dropdown-item btn_edit" href="#" data-id="${service.id}">Edit</a>
                              </li>
                              <li>
                                  <a class="dropdown-item btn_save" href="#" data-id="${service.id}" data-service-name="${service.service_name}" data-hourly-rate="${service.hourly_rate}" data-description="${service.description}" data-image="${service.image_path}">Save</a>
                              </li>
                          </ul>
                      </div>
                  
                      <h5 class="card-title">${service.service_name}</h5>
                      <h6 class="card-subtitle mb-2 text-body-secondary">
                          <p data-id="${service.user_id}">Post By: ${service.user_id}</p>
                          <p>PHP ${service.hourly_rate}</p>
                      </h6>
                      <p class="card-text">${service.description}</p>
  
                  </div>
              </div>
          </div>
      
      </div>
  </div>`;
  });

  // Assign container elements to be displayed
  document.getElementById("get_data").innerHTML = container;

  // Assign click event on Edit Btns
  document.querySelectorAll(".btn_edit").forEach((element) => {
    element.addEventListener("click", editAction);
  });

  // Event delegation for save button click
  document
    .getElementById("get_data")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("btn_save")) {
        saveAction(event);
      }
    });
}

const saveAction = async (e) => {
  const id = e.target.getAttribute("data-id");
  const service_name = e.target.getAttribute("data-service-name");
  const hourly_rate = e.target.getAttribute("data-hourly-rate");
  const description = e.target.getAttribute("data-description");
  const image_path = e.target.getAttribute("data-image");

  const { data, error } = await supabase
    .from("save")
    .insert([
      {
        id: id,
        service_name: service_name,
        hourly_rate: hourly_rate,
        description: description,
        image_path: image_path,
      },
    ])
    .select();

  if (error == null) {
    // Show success notification
    successNotification("Service Successfully Saved!", 15);

    // Modal close
    document.getElementById("modal_close").click();

    // Reload datas
    getDatas();
  } else {
    // Show error notification
    errorNotification("Something went wrong. Service not saved!", 10);
    console.log(error);
  }
};

// Storage of Id of chosen data to update
let for_update_id = "";

// Edit functionality
const editAction = async (e) => {
  e.preventDefault();
  const id = e.target.getAttribute("data-id");

  // Change background color the card that you want to edit
  document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
    "slateblue";

  // supabase show by id
  let { data: service, error } = await supabase
    .from("service")
    .select("*")
    .eq("id", id);

  if (error == null) {
    // Store id to a variable; id will be utilize for update
    for_update_id = service[0].id;

    document.getElementById("service_name").value = service[0].service_name;
    document.getElementById("hourly_rate").value = service[0].hourly_rate;
    document.getElementById("description").value = service[0].description;
    //document.getElementById("image_path").value = service[0].image_path;

    // Change Button Text using textContent; either innerHTML or textContent is fine here
    document.querySelector("#form_service button[type='submit']").textContent =
      "Update";
  } else {
    // Show error notification
    errorNotification("Something went wrong. Service cannot be showed!", 10);
    console.log(error);

    // Change background color of the card back to white
    document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
      "white";
  }

  // Show the modal
  const modalShowButton = document.getElementById("modal_show");
  modalShowButton.setAttribute("data-bs-toggle", "modal");
  modalShowButton.setAttribute("data-bs-target", "#form_modal");
  modalShowButton.click();
};
