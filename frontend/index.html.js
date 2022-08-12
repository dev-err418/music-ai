
var scrollButton = document.getElementById("top-button");
var secondDiv = document.getElementById("second-container");
var rect = secondDiv.getBoundingClientRect();

scrollButton.addEventListener("click", () => {
  window.scrollTo({ top: rect.top - window.innerHeight * 0.075, left: 0, behavior: "smooth" });
});

const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const img3 = document.getElementById("img3");
const change = document.getElementById("change");

img1.classList.add("top");
img2.classList.add("mid");
img3.classList.add("bottom");

const changeImg = () => {
  if (img1.classList.contains("top")) {
    // img 1 on top
    img3.classList.remove("bottom");
    img3.classList.add("mid");
    img1.classList.remove("top");
    img1.classList.add("bottom");
    img2.classList.remove("mid");
    img2.classList.add("top");
  } else if (img2.classList.contains("top")) {
    // img 2 on top
    img3.classList.remove("mid");
    img3.classList.add("top");
    img1.classList.remove("bottom");
    img1.classList.add("mid");
    img2.classList.remove("top");
    img2.classList.add("bottom");
  } else {
    // img 3 on top
    img3.classList.remove("top");
    img3.classList.add("bottom");
    img1.classList.remove("mid");
    img1.classList.add("top");
    img2.classList.remove("bottom");
    img2.classList.add("mid");
  }
};

window.setInterval(() => {
  changeImg();
}, 2000);



const leftpart = document.getElementById("left-part")
const leftpartRec = leftpart.getBoundingClientRect().height;
const images = document.querySelectorAll("img")
images.forEach((image) => {
  image.style.height = `calc(${leftpartRec}px)`
})

window.onresize = () => {
  const leftpartRec = leftpart.getBoundingClientRect().height;
  images.forEach((image) => {
    image.style.height = `calc(${leftpartRec}px)`
  })
}