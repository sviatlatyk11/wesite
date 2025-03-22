// DOM Elements
const resultContents = document.querySelectorAll(".results__content");
const resultBtnLeft = document.querySelector(".results__btn--left");
const resultBtnRight = document.querySelector(".results__btn--right");

const includes = document.querySelectorAll(".include");
const includesBtnLeft = document.querySelector(".includes__btn--left");
const includesBtnRight = document.querySelector(".includes__btn--right");

const nav = document.querySelector(".nav");

// Results Accordian
let currentResult = 0;

const setResult = () => {
  resultContents.forEach((el, i) => {
    el.style.transform = `translateX(${100 * (i - currentResult)}%)`;

    // Hidden Class
    el.classList.add("hidden");
  });

  resultContents[currentResult].classList.remove("hidden");
};
setResult();

const nextResult = function (e) {
  e.preventDefault();
  console.log("1");
  if (currentResult < resultContents.length - 1) currentResult++;
  else currentResult = 0;

  setResult();
};

const prevResult = function (e) {
  e.preventDefault();
  console.log("1");
  if (currentResult > 0) currentResult--;
  else currentResult = 2;

  setResult();
};

resultBtnRight.addEventListener("click", nextResult);
resultBtnLeft.addEventListener("click", prevResult);

// Includes Accordian
let currentInclude = 1;

const setIncludes = () => {
  resetIncludes();
  staticIncludes();

  let visibleIncludes = [prevInclude(), currentInclude, nextInclude()];
  //   Adding Hidden
  includes.forEach((el) => {
    if (!visibleIncludes.includes(Number(el.dataset.tab) - 1))
      el.classList.add("include--hidden");
  });
};

const prevInclude = () => {
  if (currentInclude - 1 >= 0) return currentInclude - 1;
  return 4;
};

const nextInclude = () => {
  if (currentInclude + 1 <= 4) return currentInclude + 1;
  return 0;
};

// Remove all existing helper classes
const resetIncludes = () => {
  includes.forEach((el) => {
    // Remove Hidden
    el.classList.remove("include--hidden");

    // Remove Column Placement
    for (let i = 1; i < 4; i++) {
      el.classList.remove(`include--${i}`);
    }
  });
};

// Adding Column Placement
const staticIncludes = () => {
  includes[currentInclude].classList.add("include--2");
  includes[prevInclude()].classList.add("include--1");
  includes[nextInclude()].classList.add("include--3");
};

const nextCurrentInclude = () => {
  if (currentInclude + 1 < 5) currentInclude++;
  else currentInclude = 0;

  setIncludes();
};

const prevCurrentInclude = () => {
  if (currentInclude - 1 > 0) currentInclude--;
  else currentInclude = 4;

  setIncludes();
};

setIncludes();

includesBtnLeft.addEventListener("click", prevCurrentInclude);
includesBtnRight.addEventListener("click", nextCurrentInclude);
