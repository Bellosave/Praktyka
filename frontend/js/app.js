const button = document.querySelector("#hello-button");

if (button) {
  button.addEventListener("click", () => {
    alert("Wszystko działa!");
  });
}