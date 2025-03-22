// DOM Elements
const resultContents = document.querySelectorAll(".results__content");
const resultBtnLeft = document.querySelector(".results__btn--left");
const resultBtnRight = document.querySelector(".results__btn--right");

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
