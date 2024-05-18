import {
  supabase,
  successNotification,
  errorNotification,
  doLogout,
} from "../main";

// Assign Logout Functionality
const btn_signout = document.getElementById("btn_signout");
btn_signout.onclick = doLogout;

// Load saved services
getDatas();

async function getDatas() {
  // Get all rows of tables
  let { data: services, error } = await supabase.from("save").select("*");

  if (error) {
    errorNotification("Failed to load saved services!", 10);
    console.log(error);
    return;
  }

  let container = "";
  // Get Each service and interpolate with HTML elements
  services.forEach((save) => {
    container += `<div>
      <div class="col-sm-12">
        <div class="card w-100 mt-3" data-id="${save.id}">
          <div class="row">
            <a href="#" class="btn-show card-link" data-id="${save.id}">
              <div class="col-sm-4">
                <img src="${save.image_path}" width="100%" height="225px">
              </div>
            </a>
            <div class="col-sm-8">
              <div class="card-body">
                <div class="dropdown float-end">
                  <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item btn_unsave" href="#" data-id="${save.id}">Unsave</a>
                    </li>
                  </ul>
                </div>
                <h5 class="card-title">${save.service_name}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">
                  <p>Post By: ${save.user_id}</p>
                  <p>PHP ${save.hourly_rate}</p>
                </h6>
                <p class="card-text">${save.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  });

  // Assign container elements to be displayed
  document.getElementById("get_data").innerHTML = container;

  // Assign click event on show service buttons
  document.querySelectorAll(".btn-show").forEach((element) => {
    element.addEventListener("click", showService);
  });

  // Event delegation for unsave button click
  document
    .getElementById("get_data")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("btn_unsave")) {
        unsaveAction(event);
      }
    });
}

const unsaveAction = async (e) => {
  const id = e.target.getAttribute("data-id");

  // Change background color the card that you want to delete
  document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
    "grey";

  const { error } = await supabase.from("save").delete().eq("id", id);

  if (error == null) {
    // Show success notification
    successNotification("Service Successfully Unsaved!", 15);

    // Remove the Card from the list
    document.querySelector(`.card[data-id="${id}"]`).remove();
  } else {
    // Show error notification
    errorNotification("Something went wrong. Service not unsaved!", 10);
    console.log(error);

    // Change background color the card that you want to delete
    document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
      "white";
  }
};

const showService = async (e) => {
  e.preventDefault();
  const id = e.currentTarget.getAttribute("data-id");

  // Show loading spinner
  document.getElementById("loading_spinner").style.display = "block";
  document.getElementById("service_details").style.display = "none";

  // supabase show by id
  let { data: save, error } = await supabase
    .from("save")
    .select("*")
    .eq("id", id);

  if (error == null) {
    // Populate service details
    document.getElementById("service_name_display").textContent =
      save[0].service_name;
    document.getElementById(
      "hourly_rate_display"
    ).textContent = `PHP ${save[0].hourly_rate}`;
    document.getElementById("description_display").textContent =
      save[0].description;
    document.getElementById("image_display").src = save[0].image_path;

    // Hide loading spinner and show service details
    document.getElementById("loading_spinner").style.display = "none";
    document.getElementById("service_details").style.display = "block";
  } else {
    // Show error notification
    errorNotification("Something went wrong. Service cannot be showed!", 10);
    console.log(error);
  }

  // Show the modal
  const modalShowButton = document.getElementById("modal_show");
  modalShowButton.click();
};
