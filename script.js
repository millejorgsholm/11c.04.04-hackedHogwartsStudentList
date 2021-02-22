"use strict";

window.addEventListener("DOMContentLoaded", start);

let filter = "all";

//Creating empty array
const allStudents = [];

//Creating the prototype (template)
const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  nickname: "",
  gender: "",
  house: "",
};
function start() {
  console.log("ready");

  loadJSON();
}
// TODO: Adding eventListeners to filter and sort buttons
//Filter
document
  .querySelector("[data-filter=fullStudentList]")
  .addEventListener("click", clickAllBtn);
document
  .querySelector("[data-filter=expelled]")
  .addEventListener("click", clickExpelledBtn);
document
  .querySelector("[data-filter=fullBlood]")
  .addEventListener("click", clickFullBloodBtn);

document
  .querySelector("[data-filter=halfBlood]")
  .addEventListener("click", clickHalfBloodBtn);

document
  .querySelector("[data-filter=gryffindor]")
  .addEventListener("click", clickGryffindorBtn);

document
  .querySelector("[data-filter=slytherin]")
  .addEventListener("click", clickSlytherinBtn);

document
  .querySelector("[data-filter=hufflepuff]")
  .addEventListener("click", clickHufflepuffBtn);

document
  .querySelector("[data-filter=ravenclaw]")
  .addEventListener("click", clickRavenclawBtn);

document
  .querySelector("[data-filter=prefects]")
  .addEventListener("click", clickPrefectsBtn);

//Fetching json data
function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then(response => response.json())
    .then(jsonData => {
      //When loaded, prepare objects
      prepareObjects(jsonData);
    });
  console.log("JSON data loaded");
}

function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    // TODO: Create new object with cleaned data - and store that in the allAnimals array

    //Creating the singleStudent object
    const singleStudent = Object.create(Student);

    //Find names by defining the spaces
    const firstSpace = jsonObject.fullname.trim().indexOf(" ");
    const lastSpace = jsonObject.fullname.trim().lastIndexOf(" ");

    //Split string at spaces
    //Seperate fullName in "fornavn, mellemnavn og efternavn"
    // adskil det fulde navn til for, mellem, efternavn
    singleStudent.firstName = jsonObject.fullname
      .trim()
      .substring(0, firstSpace);
    singleStudent.middleName = jsonObject.fullname.substring(
      firstSpace,
      lastSpace
    );

    //If middleName includes "", it becomes a nickName
    if (singleStudent.middleName.includes('"')) {
      singleStudent.nickName = singleStudent.middleName;
      singleStudent.middleName = "";
    }

    singleStudent.lastName = jsonObject.fullname
      .trim()
      .substring(lastSpace)
      .trim();

    //Make first letter upperCase and the rest of them lowerCase
    //firstname
    singleStudent.firstNameCapitalized =
      singleStudent.firstName.substring(0, 1).toUpperCase() +
      singleStudent.firstName.substring(1, firstSpace).toLowerCase();

    //Middlename
    singleStudent.middleNameCapitalized =
      singleStudent.middleName.substring(1, 2).toUpperCase() +
      singleStudent.middleName.substring(2, lastSpace).toLowerCase();

    //Lastname
    singleStudent.lastNameCapitalized =
      singleStudent.lastName.substring(0, 1).toUpperCase() +
      singleStudent.lastName
        .substring(1)
        .toLowerCase(singleStudent.lastName.length);

    //Names with a hyphen, must have the first letter after the hyphen capitalized as well -> one of the student's lastname includes a hyphen
    const ifHyphens = singleStudent.lastName.indexOf("-");

    if (ifHyphens == -1) {
      singleStudent.lastNameCapitalized =
        singleStudent.lastNameCapitalized.substring(0, 1).toUpperCase() +
        singleStudent.lastNameCapitalized.substring(1).toLowerCase();
    } else {
      singleStudent.lastNameCapitalized =
        singleStudent.lastName.substring(0, 1).toUpperCase() +
        singleStudent.lastName.substring(1, ifHyphens + 1).toLowerCase() +
        singleStudent.lastName
          .substring(ifHyphens + 1, ifHyphens + 2)
          .toUpperCase() +
        singleStudent.lastName.substring(ifHyphens + 2).toLowerCase();
    }

    //Gender
    singleStudent.gender = jsonObject.gender.substring(0).trim();
    singleStudent.genderCapitalized =
      singleStudent.gender.substring(0, 1).toUpperCase() +
      singleStudent.gender.substring(1).toLowerCase();

    //House
    singleStudent.house = jsonObject.house.substring(0).trim();
    singleStudent.houseCapitalized =
      singleStudent.house.substring(0, 1).toUpperCase() +
      singleStudent.house.substring(1).toLowerCase();

    //Insert in prototype -> the array
    singleStudent.firstName = singleStudent.firstNameCapitalized;
    singleStudent.middleName = singleStudent.middleNameCapitalized;
    singleStudent.lastName = singleStudent.lastNameCapitalized;

    //SingleStudent.nickName = singleStudent.nickNameCapitalized;
    singleStudent.gender = singleStudent.genderCapitalized;
    singleStudent.house = singleStudent.houseCapitalized;

    //Adding all the objects into the array
    allStudents.push(singleStudent);
  });
  //Calling the function displayList
  displayList();
}

function displayList() {
  //Clear the list
  document.querySelector("#list tbody").innerHTML = "";

  //Build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  //Create clone
  const clone = document
    .querySelector("template#studenttemplate")
    .content.cloneNode(true);

  //Set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  clone.querySelector("[data-field=middlename]").textContent =
    student.middleName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=image] img").src = `images/${
    student.lastName
  }_${student.firstName.charAt(0)}.png`;

  //Append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

//Popup

const popup = document.querySelector("studenttemplate");

function studentPopup(student) {
  console.log(student);
  popup.querySelector("[data-field=firstname]").textContent = student.firstName;
  popup.querySelector("[data-field=middlename]").textContent =
    student.middleName;
  popup.querySelector("[data-field=lastname]").textContent = student.lastName;
  popup.querySelector("[data-field=nickname]").textContent = student.nickName;
  popup.querySelector("[data-field=gender]").textContent = student.gender;
  popup.querySelector("[data-field=house]").textContent = student.house;
  //   popup.querySelector("[data-field=image] img").src = `images/${
  //     student.lastName
  //   }_${student.firstName.charAt(0)}.png`;

  popup.style.display = "block";
}

document.querySelector("#closeButton").addEventListener("click", closepopop);

function closepopop() {
  popop.style.display = "none";
}
