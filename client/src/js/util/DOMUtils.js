
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
}
