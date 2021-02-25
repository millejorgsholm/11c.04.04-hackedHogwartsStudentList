"use strict";

window.addEventListener("DOMContentLoaded", start);

const popup = document.querySelector(".popup");

let allStudents = []; //Creating empty array
let allStudentsFiltered = [];
let allStudentsExpelled = [];

const Student = {
  //Creating the prototype template
  firstname: "",
  lastname: "",
  middlename: "null",
  nickname: "null",
  gender: "",
  house: "",
  imageSrc: "null",
  prefect: false,
  bloodstatus: false,
  member: false,
  expel: false,
};

const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};

function start() {
  console.log("ready");
  registerButtons();
  loadJSON();
}

function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach(button => button.addEventListener("click", selectFilter));

  document
    .querySelectorAll("[data-action='sort']")
    .forEach(button => button.addEventListener("click", selectSort));
}

function loadJSON() {
  //Fetching json data
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
  displayList(allStudents);
  buildList();
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  if (settings.filterBy === "gryffindor") {
    //create a filter of only cats
    filteredList = allStudents.filter(isGryf);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRave);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlyt);
  }
  return filteredList;
}

function isEnrolled(status) {
  return status.house === "Enrolled";
}

function isGryf(house) {
  return house.house === "Gryffindor";
}

function isHuff(house) {
  return house.house === "Hufflepuff";
}

function isRave(house) {
  return house.house === "Ravenclaw";
}

function isSlyt(house) {
  return house.house === "Slytherin";
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // toggle the direction!
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1; // 1 is normal direction.
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

function displayList(studentList) {
  //Clear the list
  document.querySelector("#list").innerHTML = "";

  //Build a new list
  studentList.forEach(displayStudent);
}

function displayStudent(student) {
  //Create clone
  const clone = document
    .querySelector("template#hogwarts_student")
    .content.cloneNode(true);

  //Set clone data
  clone.querySelector("[data-field=firstname]").textContent =
    "Firstname:  " + student.firstName;
  clone.querySelector("[data-field=middlename]").textContent =
    student.middleName;
  clone.querySelector("[data-field=lastname]").textContent =
    "Lastname:  " + student.lastName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("[data-field=gender]").textContent =
    "Gender: " + student.gender;
  clone.querySelector("[data-field=house]").textContent =
    "House:  " + student.house;
  clone.querySelector("[data-field=image] img").src = `images/${
    student.lastName
  }_${student.firstName.charAt(0)}.png`;
  clone
    .querySelector("article")
    .addEventListener("click", () => showDetails(student));

  //Append clone to list
  document.querySelector("#list").appendChild(clone);
}

//Showing Popup when clicking on a student
function showDetails(student) {
  console.log(student);
  console.log("open popup");
  document.querySelector(".expelBtn").onclick = () => {
    expelStudent(student);
  };
  popup.querySelector(".popupName").textContent = student.firstName;
  popup.querySelector(".popupHouse").textContent = "House:  " + student.house;
  // popup.querySelector(".popupResponsibility").textContent =
  //   "Responsibility:  " + student.responsibility;
  // popup.querySelector(".popupBlood").textContent =
  //   "Bloodstatus:  " + student.blood;
  // popup.querySelector(".popupPrefect").textContent =
  //   "Prefect:  " + student.prefect;
  // popup.querySelector(".popupMember").textContent =
  //   "Member of inquisitorial squad:  " + student.squad;
  popup.querySelector(".popupExpelled").textContent =
    "Status:  " + student.expel;
  popup.querySelector("img").src = `images/${
    student.lastName
  }_${student.firstName.charAt(0)}.png`;

  //Then students status is set (whether they are enrolled or expelled)
  if (student.expel === true) {
    popup.querySelector(".popupExpelled").textContent = "Status: Expelled";
  } else {
    popup.querySelector(".popupExpelled").textContent = "Status: Enrolled";
  }

  //When click on btn it makes student prefect
  popup.querySelector(".prefectBtn").dataset.prefect = student.prefect;

  popup.querySelector(".prefectBtn").addEventListener("click", clickPrefect);
  function clickPrefect() {
    if (student.prefect === true) {
      console.log("student prefect false");
      student.prefect = false;
    } else {
      console.log("try to make");
      tryToMakeAPrefect(student);
    }

    showDetails(student);
  }

  //Housecrests and article color change so it matches the house that the student belongs to

  if (student.house === "Gryffindor") {
    console.log("This student belongs to Gryffindor");
    //Housecrests change so it matches the house that the student belongs to
    popup.querySelector(
      ".popupCrest"
    ).src = `crests/Gryffindor-Crest-Color.svg`;

    //Popup background color matches the house that the student belongs to
    popup.querySelector("article").style.backgroundColor = "#d33d3d";
  }

  if (student.house === "Slytherin") {
    console.log("This student belongs to Slytherin");
    popup.querySelector(".popupCrest").src = `crests/Slytherin-Crest-Color.svg`;

    popup.querySelector("article").style.backgroundColor = "#4b9b66";
  }

  if (student.house === "Hufflepuff") {
    console.log("This student belongs to Hufflepuff");
    popup.querySelector(
      ".popupCrest"
    ).src = `crests/Hufflepuff-Crest-Color.svg`;

    popup.querySelector("article").style.backgroundColor = "#f1de6f";
  }

  if (student.house === "Ravenclaw") {
    console.log("This student belongs to Ravenclaw");
    popup.querySelector(".popupCrest").src = `crests/Ravenclaw-Crest-Color.svg`;

    popup.querySelector("article").style.backgroundColor = "#4960ac";
  }

  popup.style.display = "block";
}

//Closing popup when click on button
document.querySelector(".closeButton").addEventListener("click", closePopup);

function closePopup() {
  console.log("close popup");
  popup.style.display = "none";
}

//Expel student
function expelStudent(student) {
  console.log(student);
  if (student.expel === true) {
    console.log("Enrolled");
    student.expel = false;
  } else {
    console.log("Expelled");
    student.expel = true;
  }

  //Button and status changes when click on btn
  if (student.expel === true) {
    popup.querySelector(".expelBtn").textContent = "Unexpel student";
    popup.querySelector(".popupExpelled").textContent = "Status: Expelled";
  } else {
    popup.querySelector(".expelBtn").textContent = "Expel student";
    popup.querySelector(".popupExpelled").textContent = "Status: Enrolled";
  }
}
//Make student prefect
function tryToMakeAPrefect(selectedStudent) {
  console.log("we are in the tryToMake function");

  const allPrefects = allStudents.filter(student => student.prefect); //should give a list of alle the prefects
  const prefects = allPrefects.filter(
    prefect => prefect.house === selectedStudent.house
  );
  console.log(prefects);

  const numbersOfPrefects = prefects.length;
  const other = prefects
    .filter(
      prefect =>
        prefect.house === selectedStudent.house &&
        prefect.gender === selectedStudent.gender
    )
    .shift();
  console.log(other);

  // if there is another of the same type
  if (other !== undefined) {
    console.log("there can only be one prefect of each type");
    removeOther(other);
  } else if (numbersOfPrefects >= 2) {
    console.log("there can only be two prefects");
    removeAorB(prefects[0], prefects[1]);
    //fjerne denne
  } else {
    makePrefect(selectedStudent);
  }

  function removeOther(other) {
    // ask the user to ignore or remove "other"
    document.querySelector("#remove_other").classList.remove("hide2");
    document
      .querySelector("#remove_other .closebutton")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#remove_other #removeother")
      .addEventListener("click", clickRemoveOther);

    //document.querySelector("#remove_other [data-field=otherwinner]").textContent = other.firstName;

    //if ignore - do nothing
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide2");
      document
        .querySelector("#remove_other .closebutton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_other #removeother")
        .removeEventListener("click", clickRemoveOther);
    }

    //if remover other:
    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(selectedStudent);
      buildList();
      //displayModal(student);
      closeDialog();
    }
  }

  function removeAorB(winnerA, winnerB) {
    // ask the user to ignore or remove a or b

    document.querySelector("#remove_aorb").classList.remove("hide2");
    document
      .querySelector("#remove_aorb .closebutton")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#remove_aorb #removea")
      .addEventListener("click", clickRemoveA);
    document
      .querySelector("#remove_aorb #removeb")
      .addEventListener("click", clickRemoveB);

    //show names on buttons
    document.querySelector("#remove_aorb [data-field=prefectA]").textContent =
      prefectA.firstName;
    document.querySelector("#remove_aorb [data-field=prefectB]").textContent =
      prefectB.firstName;

    //if ignore - do nothing
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide2");
      document
        .querySelector("#remove_aorb .closebutton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_aorb #removea")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#remove_aorb #removeb")
        .removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      //if removeA:
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      //displayModal(student);
      closeDialog();
    }

    function clickRemoveB() {
      //else - if removeB
      removePrefect(winnerB);
      makePrefect(selectedStudent);
      buildList();
      //displayModal(student);
      closeDialog();
    }
  }

  function removePrefect(prefectStudent) {
    console.log("remove prefect");
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    console.log("make prefect");
    student.prefect = true;
  }
}
