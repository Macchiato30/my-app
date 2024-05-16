import { supabase, doLogout } from "../main";

const btn_signout = document.getElementById("btn_signout");

btn_signout.onclick = doLogout;

// Load saved services from local storage
const savedServices = JSON.parse(localStorage.getItem("savedServices")) || [];

// Display saved services
const savedServicesContainer = document.getElementById("saved_services");
savedServices.forEach((service) => {
  const serviceCard = document.createElement("div");
  serviceCard.classList.add("card", "mb-3");
  serviceCard.innerHTML = `
    <div class="row g-0">
      <div class="col-md-4">
        <img src="${service.image_path}" class="img-fluid rounded-start" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${service.service_name}</h5>
          <p>${service.hourly_rate}</p>
          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
        </div>
      </div>
    </div>
  `;
  savedServicesContainer.appendChild(serviceCard);
});
