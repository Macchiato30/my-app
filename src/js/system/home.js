import {
  supabase,
  successNotification,
  errorNotification,
  doLogout,
} from "../main";

// Load data
getDatas();

// Assign Logout Functionality
const btn_signout = document.getElementById("btn_signout");
btn_signout.onclick = doLogout;

const form_service = document.getElementById("form_service");

form_service.onsubmit = async (e) => {
  e.preventDefault();

  // Get all values from input, textarea under forms
  const formData = new FormData(form_service);

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
    successNotification("Service Successfully Uploaded!</a>", 15);

    // Modal close
    document.getElementById("modal_close").click();
    // Reload datas
    getDatas();
  } else {
    errorNotification("Something went wrong. Service not uploaded!", 10);
    console.log(error);
  }

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
    <div class="card w-100 mt-3" data-id="${service.service_id}">

        <div class="row">
            <div class="col-sm-4">
                <img src="service.image_path
                }" width="100%" height="225px">
            </div>

            <div class="col-sm-8">
                <div class="card-body">
            
                    <div class="dropdown float-end">
                        <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                        <ul class="dropdown-menu">
                            <li>
                                <a class="dropdown-item" href="#" id="btn_edit" data-id="${service.service_id}">Save</a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" id="btn_save" data-id="${service.service_id}">Share</a>
                            </li>
                        </ul>
                    </div>
                
                    <h5 class="card-title">${service.service_name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">
                        <small>${service.hourly_rate}</small>
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

  // Assign click event on save Btns
  document.querySelectorAll("#btn_save").forEach((service) => {
    service.addEventListener("click", saveAction);
  });
}

// save functionality

const saveAction = async (e) => {
  // Get service ID
  const service_id = e.target.getAttribute("data-id");

  // Get service data
  let { data: services, error } = await supabase
    .from("service")
    .select("*")
    .eq("service_id", service_id);

  // Get service data
  let service = services[0];

  // Add the service to saved services in local storage
  const savedServices = JSON.parse(localStorage.getItem("savedServices")) || [];
  savedServices.push(service);
  localStorage.setItem("savedServices", JSON.stringify(savedServices));

  // Show Notification
  successNotification("Service Successfully Saved!", 15);
};
