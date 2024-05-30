const pl = document.getElementById('pl');
fetch('/api/pl.json')
.then(response => response.json())
.then(data => {
  data.forEach(item => {
    let grid = document.createElement('div');
    grid.style.backgroundImage = item.gradient;
    grid.classList.add('grid');
    let logo = document.createElement('img');
    logo.src = item.logo;
    logo.classList.add('logo')
    let text = document.createElement('a');
    text.innerHTML = `${item.name}<br><span style="font-style: italic;">${item.exp}</span>`;
    text.classList.add('text')

    grid.appendChild(text);
    grid.appendChild(logo);
    pl.appendChild(grid);
  });
})

const element = document.querySelector('.pane');
const tiltDeg = 15;

function tiltpane() {
  element.addEventListener('mousemove', ({
    clientX,
    clientY
  }) => {
    const bcr = element.getBoundingClientRect();
    const rotX = ((clientY - bcr.top) / bcr.height * 2 - 1) * tiltDeg;
    const rotY = ((clientX - bcr.left) / bcr.width * 2 - 1) * -tiltDeg;
    element.firstElementChild.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  element.addEventListener('mouseleave', () => {
    element.firstElementChild.style.transform = `rotateX(0deg) rotateY(0deg)`;
  });
}

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain attribute:*/
    file = elmnt.getAttribute("ihtml");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("ihtml");
          includeHTML();
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
};