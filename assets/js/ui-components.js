//GENERAL DROPDOWNS
document.body.addEventListener("click", () => { document.querySelectorAll(".dropdown-options.opened").forEach((ele) => { ele.classList.remove("opened") }) })

function resetDropdowns(event, parent) {
  event.stopPropagation()
  if (parent.classList.contains("opened")) {
    parent.classList.remove("opened")
  } else {
    //RESET ALL DROPDOWNS TO CLOSED STATE ONLY WHEN OPENING NEW DROPDOWN
    for (const drop of document.querySelectorAll(".dropdown-options")) { drop.classList.remove("opened") }
    parent.classList.add("opened")
  }
}

function addDropdownEvents(target, fn) {
  for (const dropdown of document.querySelectorAll(".dropdown-" + target)) {
    dropdown.addEventListener("click", (event) => {
      const self = event.target.parentNode.classList.contains("option") ? event.target.parentNode : (event.target.querySelector(".option.selected") ? event.target.querySelector(".option.selected") : event.target)
      const parentEle = self.parentNode
      //IF TARGET IS AN UN-SELECTED CHILD ELEMENT
      if (!self.classList.contains("selected") && self.classList.contains("option")) {
        event.stopPropagation()

        parentEle.querySelectorAll(".selected").forEach((ele) => { ele.classList.remove("selected") })
        self.classList.add("selected")
        parentEle.classList.remove("opened")
        const platform = parentEle.classList.contains("dropdown-platform") ? self.getAttribute("data") : false
        if (platform) {
          document.querySelectorAll(".dropdown-platform > .selected").forEach((selected) => { selected.classList.remove("selected") })
          document.querySelectorAll(".dropdown-platform > ." + platform).forEach((newOpt) => { newOpt.classList.add("selected") })
        }
        fn()
        return
      }
      resetDropdowns(event, parentEle)
    })
  }
}