"use strict";

window.addEventListener("DOMContentLoaded", start);

let students;
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
  // TODO: Adding eventListeners to filter and sort buttons
  //Filter
  // document
  //   .querySelector("[data-filter=fullStudentList]")
  //   .addEventListener("click", clickFullListBtn);
  // document
  //   .querySelector("[data-filter=expelled]")
  //   .addEventListener("click", clickExpelledBtn);
  // document
  //   .querySelector("[data-filter=fullBlood]")
  //   .addEventListener("click", clickFullBloodBtn);

  // document
  //   .querySelector("[data-filter=halfBlood]")
  //   .addEventListener("click", clickHalfBloodBtn);

  // document
  //   .querySelector("[data-filter=gryffindor]")
  //   .addEventListener("click", clickGryffindorBtn);

  // document
  //   .querySelector("[data-filter=slytherin]")
  //   .addEventListener("click", clickSlytherinBtn);

  // document
  //   .querySelector("[data-filter=hufflepuff]")
  //   .addEventListener("click", clickHufflepuffBtn);

  // document
  //   .querySelector("[data-filter=ravenclaw]")
  //   .addEventListener("click", clickRavenclawBtn);

  // document
  //   .querySelector("[data-filter=prefects]")
  //   .addEventListener("click", clickPrefectsBtn);

  // //Sort
  // document
  //   .querySelector("[data-sort=firstName]")
  //   .addEventListener("click", clickSortFirstName);

  // document
  //   .querySelector("[data-sort=lastName]")
  //   .addEventListener("click", clickSortLastName);

  // document
  //   .querySelector("[data-sort=gryffindor]")
  //   .addEventListener("click", clickSortGryffindor);

  // document
  //   .querySelector("[data-sort=slytherin]")
  //   .addEventListener("click", clickSortSlytherin);

  // document
  //   .querySelector("[data-sort=hufflepuff]")
  //   .addEventListener("click", clickSortHufflepuff);

  // document
  //   .querySelector("[data-sort=ravenclaw]")
  //   .addEventListener("click", clickSortRavenclaw);

  // document
  //   .querySelector("[data-sort=prefects]")
  //   .addEventListener("click", clickSortPrefects);

  loadJSON();
}

//Fetching json data
function loadJSON() {
  console.log("JSON data loaded");
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then(response => response.json())
    .then(jsonData => {
      //When loaded, prepare objects
      prepareObjects(jsonData);
      showStudents();
    });
}

function prepareObjects(jsonData) {
  console.log("prepareObjects");
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
  console.log("displayList");
  //Clear the list
  document.querySelector("#listview").innerHTML = "";

  //Build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  console.log("displayStudent");
  //Create clone
  const clone = document
    .querySelector("template#studenttemplate")
    .content.cloneNode(true);

  //Append clone to list
  document.querySelector("#listview").appendChild(clone);
}

//Cloning template into list
function showStudents() {
  const list = document.querySelector("#listview");
  const menuTemplate = document.querySelector("template");
  list.innerHTML = "";
  stundets.feed.entry.forEach(student => {
    let clone = studentTemplate.cloneNode(true).content;
    clone.querySelector(".firstName").textContent = student.firstName;
    clone.querySelector(".lastName").textContent = student.lastName;
    clone.querySelector(".house").textContent = student.house;
    clone.querySelector("img").src = `images/${
      student.lastName
    }_${student.firstName.charAt(0)}.png`;
    clone
      .querySelector("article")
      .addEventListener("click", () => showDetails(student));
    list.appendChild(clone);
    console.log(student);
  });
}
