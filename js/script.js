// DOM Elements
// Results Carousel
const resultContents = document.querySelectorAll(".results__content");
const resultBtnLeft = document.querySelector(".results__btn--left");
const resultBtnRight = document.querySelector(".results__btn--right");

// Includes Carousel
const includes = document.querySelectorAll(".include");
const includesBtnLeft = document.querySelector(".includes__btn--left");
const includesBtnRight = document.querySelector(".includes__btn--right");

// Navigation Highlights
const nav = document.querySelector(".header__nav");
const navBtns = document.querySelectorAll(".nav__btn");

// Section Navigation
const sections = document.querySelectorAll(".section--hidden");

// Block Movement
const blockEls = document.querySelectorAll(".for__block");

// Dropdown Reveal
const heroSection = document.querySelector(".hero");
const dropdown = document.querySelector(".dropdown");

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
  if (currentResult < resultContents.length - 1) currentResult++;
  else currentResult = 0;

  setResult();
};

const prevResult = function (e) {
  e.preventDefault();
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
  if (currentInclude + 1 <= 4) currentInclude++;
  else currentInclude = 0;

  setIncludes();
};

const prevCurrentInclude = () => {
  if (currentInclude - 1 >= 0) currentInclude--;
  else currentInclude = 4;

  setIncludes();
};

setIncludes();

includesBtnLeft.addEventListener("click", prevCurrentInclude);
includesBtnRight.addEventListener("click", nextCurrentInclude);

// Nav Opacity
nav.addEventListener("mouseover", function (e) {
  const target = e.target.closest(".nav__btn");
  if (target) {
    navBtns.forEach((el) => {
      if (el != target) el.style.opacity = 0.5;
    });
    target.style.opacity = 1;
  } else {
    navBtns.forEach((el) => {
      el.style.opacity = 1;
    });
  }
});

// Nav Sections
navBtns.forEach((btn) => {
  if (btn.dataset.section) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      document
        .querySelector(`.${btn.dataset.section}`)
        .scrollIntoView({ behavior: "smooth" });
    });
  }
});

// Section Reveal
const revealSection = function (entries, _) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove("section--hidden");
      sectionObserver.unobserve(entry.target);
    }
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0,
});

sections.forEach((el) => {
  sectionObserver.observe(el);
});

// Block Movement
class Grid {
  #grid;
  lastMovedBlock = null;

  constructor(blocks = []) {
    this.grid = blocks; // Initialize grid using the setter
  }

  get grid() {
    return this.#grid;
  }

  set grid(blocks = []) {
    let emGrid = Array.from({ length: 2 }, () => Array(4).fill(null));
    blocks.forEach((block) => {
      let row = Math.floor(block.currentPosition / 4);
      let column = block.currentPosition % 4;
      emGrid[row][column] = block;
    });
    this.#grid = emGrid;
  }

  get emptyPositions() {
    return this.#grid.flat().reduce((acc, el, i) => {
      if (el === null) acc.push(i);
      return acc;
    }, []);
  }

  get moveableBlocks() {
    const mBlocks = [];
    this.emptyPositions.forEach((emptyIndex) => {
      let emptyColumn = emptyIndex % 4;
      let emptyRow = Math.floor(emptyIndex / 4);
      const edgeLeftCase = emptyColumn === 0;
      const edgeRightCase = emptyColumn === 3;

      const adjacentPositions = [
        emptyIndex + 4, // Down
        edgeLeftCase ? -1 : emptyIndex - 1, // Left
        emptyIndex - 4, // Up
        edgeRightCase ? -1 : emptyIndex + 1, // Right
      ].map((pos) => {
        if (pos >= 0 && pos <= 7) {
          return pos;
        }
        return null;
      });

      adjacentPositions.forEach((pos, direction) => {
        if (
          pos !== null &&
          this.getValue(pos) !== null &&
          this.getValue(pos) !== this.lastMovedBlock
        ) {
          mBlocks.push({
            block: this.getValue(pos),
            direction: direction,
            destRow: emptyRow,
            destColumn: emptyColumn,
            destPos: emptyIndex,
          });
        }
      });
    });
    return mBlocks;
  }

  getValue(pos) {
    return this.grid[Math.floor(pos / 4)][pos % 4];
  }

  async moveBlock() {
    const selectedMove =
      this.moveableBlocks[
        Math.floor(Math.random() * this.moveableBlocks.length)
      ];

    const { block, direction, destRow, destColumn, destPos } = selectedMove;

    this.setPosition(block.row, block.column, null);

    // Await the slide animation
    await block.slide(direction);

    block.updatePosition(destRow, destColumn, destPos);
    this.setPosition(destRow, destColumn, block);
    this.lastMovedBlock = block;
  }

  setPosition(row, column, value) {
    this.grid[row][column] = value; // Set the value at the specified (x, y) position
  }

  set lastMovedBlock(block) {
    this._lastMovedBlock = block;
  }

  get lastMovedBlock() {
    return this._lastMovedBlock;
  }
}

class Block {
  #currentPosition;
  #element;

  constructor(el) {
    this.#currentPosition = Number(el.dataset.pos);
    this.#element = el;
  }

  get currentPosition() {
    return this.#currentPosition;
  }

  set currentPosition(pos) {
    this.#currentPosition = pos;
    this.#element.dataset.pos = `${pos}`;
  }

  get target() {
    return this.#element;
  }

  get row() {
    return Math.floor(this.#currentPosition / 4);
  }

  get column() {
    return this.#currentPosition % 4;
  }

  slide(direction) {
    return new Promise((resolve) => {
      // Reset Transition
      this.target.style.transition = "all 2s";

      // Set Transform
      const xAxis = direction === 1 || direction === 3; // Horizontal movement
      const magnitude = direction < 2 ? 1 : -1; // 1 for down/right, -1 for up/left
      this.target.style.transform = xAxis
        ? `translateX(${100 * magnitude}%)`
        : `translateY(${100 * -magnitude}%)`;

      // Animation Wait
      setTimeout(() => {
        this.target.style.transition = "none";

        this.target.style.transform = "none";
        resolve();
      }, 2000);
    });
  }

  updatePosition(row, column, destination) {
    // Update the grid positioning
    this.#element.style.gridColumn = `${column + 1}`;
    this.#element.style.gridRow = `${row + 1}`;
    this.currentPosition = destination; // Update current position
  }
}

const x = [];
blockEls.forEach((block) => {
  x.push(new Block(block));
});

const grid = new Grid(x);

setInterval(() => {
  grid.moveBlock();
}, 2500);

// Dropdown Reveal
const revealDropdown = function (entries) {
  [entry] = entries;
  if (entry.isIntersecting) {
    dropdown.classList.add("hidden");
  } else {
    dropdown.classList.remove("hidden");
  }
};

const heroObserver = new IntersectionObserver(revealDropdown, {
  root: null,
  threshold: 0.1,
});
heroObserver.observe(heroSection);
