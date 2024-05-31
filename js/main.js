function _topnav() {
  const topnav = document.querySelector('.topnav');
  fetch('/api/topnav.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      let _a = window.location.href.split('/');
      let _b = _a[_a.length-1];
      let _dir = _b.split('.')[0];
      let _name = item.name.toLowerCase();
      let e = document.createElement(item.type);
      if (item.type === 'a') {
        e.innerHTML = item.name;
        if (_name === _dir || _dir === '' && _name === 'home') {
          e.classList.add('active');
        } else {
          if (item.href === '/') {
            e.href = '/';
          } else {
            e.href = `${item.href}.html`;
          }
        }
      } else if (item.type === 'div') {
        e.classList.add('dropdown')
        let button = document.createElement('button');
        button.innerHTML = `${item.name} `;
        button.classList.add('dropbtn');
        let i = document.createElement('i');
        i.classList.add('fa');
        i.classList.add('fa-caret-down');
        button.appendChild(i);
        e.appendChild(button);
        let dropdown_content = document.createElement('div');
        dropdown_content.classList.add('dropdown-content');
        e.appendChild(dropdown_content)
        item.es.forEach(item2 => {
          let _c = document.createElement('a');
          _c.innerHTML = item2.name;
          _c.href = `${item2.href}.html`;
          let _d = item2.href.split('/');
          let _e = _d[_d.length-1];
          dropdown_content.appendChild(_c);
          if (_dir === _e) {
            e.classList.add('active');
          }
        })
      }
      topnav.appendChild(e);
    });
  })
}
_topnav();

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