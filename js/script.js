// DOM Elements
// Results Carousel
const resultContents = document.querySelectorAll(".results__content");
const resultBtnLeft = document.querySelector(".results__btn--left");
const resultBtnRight = document.querySelector(".results__btn--right");
const resultsSection = document.querySelector(".results__content--wrapper");

// Includes Carousel
const includesCarousel = document.querySelector(".includes__carousel");
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

// Mobile Navigation
const openMobile = document.querySelector(".btn-mobile-nav--open");
const closeMobile = document.querySelector(".btn-mobile-nav--close");
const mobileNav = document.querySelector(".main-nav");

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

const nextResult = function (e = null) {
  if (e) e.preventDefault();
  if (currentResult < resultContents.length - 1) currentResult++;
  else currentResult = 0;

  setResult();
};

const prevResult = function (e = null) {
  if (e) e.preventDefault();
  if (currentResult > 0) currentResult--;
  else currentResult = 2;

  setResult();
};

resultBtnRight.addEventListener("click", nextResult);
resultBtnLeft.addEventListener("click", prevResult);

// Results Mobile Swiping
let startX = 0;
let endX = 0;

resultsSection.addEventListener("touchstart", function (e) {
  startX = e.touches[0].clientX;
});

resultsSection.addEventListener("touchmove", function (e) {
  endX = e.touches[0].clientX;
});

resultsSection.addEventListener("touchend", function () {
  let deltaX = startX - endX;

  if (deltaX > 30) {
    nextResult();
  } else if (deltaX < -30) {
    prevResult();
  }
});

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

// Mobile Includes Scrolling
let startY = 0;
let endY = 0;
let scrolls = 0;

includesCarousel.addEventListener("touchstart", function (e) {
  if (scrolls < 4) e.preventDefault();
  startY = e.touches[0].clientY;
});

includesCarousel.addEventListener("touchmove", function (e) {
  endY = e.touches[0].clientY;
});

includesCarousel.addEventListener("touchend", function () {
  let deltaY = startY - endY;

  if (deltaY > 30) {
    nextCurrentInclude();
  } else if (deltaY < -30) {
    prevCurrentInclude();
  }

  scrolls++;
  if (scrolls >= 5) scrolls = 0;
});

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
    this.rows = this.calculateRows();
    this.columns = this.calculateColumns();
    this.grid = blocks;
    this.windowWidth = window.innerWidth;
  }

  calculateColumns() {
    if (window.innerWidth <= 592) {
      return 2;
    }
    return 4;
  }

  calculateRows() {
    if (window.innerWidth <= 592) {
      return 3;
    }
    return 2;
  }

  compareWindow() {
    return this.windowWidth >= 592 && window.innerWidth >= 592;
  }

  get grid() {
    return this.#grid;
  }

  set grid(blocks = []) {
    let emGrid = Array.from({ length: this.rows }, () =>
      Array(this.columns).fill(null)
    );

    blocks.forEach((block) => {
      let row = Math.floor(block.currentPosition / this.columns);
      let column = block.currentPosition % this.columns;
      emGrid[row][column] = block;
    });
    this.#grid = emGrid;
    this.initBlocks();
  }

  initBlocks() {
    this.#grid.flat().forEach((el, pos) => {
      if (el)
        el.updatePosition(
          Math.floor(pos / this.columns),
          pos % this.columns,
          pos
        );
    });
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
      let emptyColumn = emptyIndex % this.columns;
      let emptyRow = Math.floor(emptyIndex / this.columns);
      const edgeLeftCase = emptyColumn === 0;
      const edgeRightCase = emptyColumn === this.columns - 1;

      const adjacentPositions = [
        emptyIndex + this.columns, // Down
        edgeLeftCase ? -1 : emptyIndex - 1, // Left
        emptyIndex - this.columns, // Up
        edgeRightCase ? -1 : emptyIndex + 1, // Right
      ].map((pos) => {
        if (pos >= 0 && pos < this.rows * this.columns) {
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
    const row = Math.floor(pos / this.columns);
    const col = pos % this.columns;
    return this.grid[row]?.[col] ?? null;
  }

  async moveBlock() {
    const moves = this.moveableBlocks;
    if (moves.length === 0) return;

    const selectedMove = moves[Math.floor(Math.random() * moves.length)];

    const { block, direction, destRow, destColumn, destPos } = selectedMove;

    this.setPosition(block.row, block.column, null);

    // Await the slide animation
    await block.slide(direction, this.columns);

    block.updatePosition(destRow, destColumn, destPos);
    this.setPosition(destRow, destColumn, block);
    this.lastMovedBlock = block;
  }

  setPosition(row, column, value) {
    this.grid[row][column] = value;
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
    return Math.floor(this.#currentPosition / grid.columns);
  }

  get column() {
    return this.#currentPosition % grid.columns;
  }

  slide(direction, columns) {
    return new Promise((resolve) => {
      // Reset Transition
      this.target.style.transition = "all 0.5s";

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
      }, 500);
    });
  }

  updatePosition(row, column, destination) {
    this.#element.style.gridColumn = `${column + 1}`;
    this.#element.style.gridRow = `${row + 1}`;
    this.currentPosition = destination;
  }
}

const resetBlockPositions = () => {
  const positions = window.innerWidth > 592 ? [0, 2, 3, 5, 6] : [0, 2, 3, 4, 5];
  blockEls.forEach((block, i) => (block.dataset.pos = positions[i]));
};

const createGrid = () => {
  const blocks = Array.from(blockEls).map((block) => new Block(block));
  return new Grid(blocks, window.innerWidth);
};

resetBlockPositions();
let grid = createGrid();

setInterval(() => {
  grid.moveBlock();
}, 2000);

window.addEventListener("resize", function () {
  if (!grid.compareWindow()) {
    resetBlockPositions();
    grid = createGrid();
  }
});

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

// Mobile Navigation
openMobile.addEventListener("click", () => {
  mobileNav.classList.add("nav-open");
  closeMobile.classList.remove("remove");
  openMobile.classList.add("remove");
});

closeMobile.addEventListener("click", () => {
  mobileNav.classList.remove("nav-open");
  closeMobile.classList.add("remove");
  openMobile.classList.remove("remove");
});
