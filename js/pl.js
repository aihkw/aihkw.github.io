// Programming Languages
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