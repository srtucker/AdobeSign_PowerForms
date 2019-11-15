
export default {
  removeClass: function(node, className){
    if(node.classList.contains(className)) {
      node.classList.remove(className);
    }
  },
  removeElement: function(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },
  hide: function(element) {
    let display = element.style.display
    if ( display !== "none" ) {
      element.style.display = "none";
    }
  },
  show: function(element) {
    let display = element.style.display;
    console.log(display)
    if ( display === "none" || display === "" ) {
      element.style.display = "block";
    }
  },
}
