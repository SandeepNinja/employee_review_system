console.log("I am employee java script");

const editBtn = document.getElementsByClassName("edit");

for (let i = 0; i < editBtn.length; i++) {
  const editOff = document.getElementsByClassName("editOff");
  const editOn = document.getElementsByClassName("editOn");

  function editOffFun() {
    let x1 = 3 * i;
    let x2 = x1 + 3;
    for (let j = x1; j < x2; j++) {
      editOff[j].style.display = "none";
      editOn[j].style.display = "inline-block";
    }
    // ----------------------
  }

  editBtn[i].addEventListener("click", editOffFun);
}
