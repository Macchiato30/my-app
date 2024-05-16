import { supabase, doLogout } from "../main";

const btn_signout = document.getElementById("btn_signout");

btn_signout.onclick = doLogout;

const form_profile = document.getElementById("form_profile");

form_profile.onsubmit = async (e) => {
  e.preventDefault();

  alert("Hello World");
};

// Load items funcionality
