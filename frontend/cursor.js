let innerCursor = document.querySelector(".inner-cursor");
//let outerCursor = document.querySelector(".outer-cursor");

const moveCursor = (e) => {
  let x = e.clientX;
  let y = e.clientY;
  innerCursor.style.left = `${x}px`;
  innerCursor.style.top = `${y}px`;
//  outerCursor.style.left = `${x}px`;
//  outerCursor.style.top = `${y}px`;
};

document.addEventListener("mousemove", moveCursor);

let clickables = Array.from(document.querySelectorAll("h1"));

clickables.forEach((clickable) => {
  clickable.addEventListener("mouseover", () => {
    innerCursor.classList.add("grow");
  });
  clickable.addEventListener("mouseleave", () => {
    innerCursor.classList.remove("grow");
  });
});

let buttons = Array.from(document.querySelectorAll("button"));
buttons.forEach((clickable) => {
  clickable.addEventListener("mouseover", () => {
    innerCursor.classList.add("grow");
  });
  clickable.addEventListener("mouseleave", () => {
    innerCursor.classList.remove("grow");
  });
});

let animation = Array.from(document.querySelectorAll("li"));
animation.forEach((clickable) => {
  clickable.addEventListener("mouseover", () => {
    innerCursor.classList.add("grow");
  });
  clickable.addEventListener("mouseleave", () => {
    innerCursor.classList.remove("grow");
  });
});

let playButtons = Array.from(document.querySelectorAll(".play-button"))
playButtons.forEach((clickable) => {
  clickable.addEventListener("mouseover", () => {
    innerCursor.classList.add("grow");
  });
  clickable.addEventListener("mouseleave", () => {
    innerCursor.classList.remove("grow");
  });
});