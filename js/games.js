const parent = document.querySelector('.grid-container')
fetch('/api/games.json')
.then(response => response.json())
.then(data => {
    data.forEach(item => {
        let grid = document.createElement('div');
        grid.style.backgroundImage = `url(${item.src})`;
        grid.setAttribute('onclick', `window.location.href = '${item.href}.html'`)
        grid.classList.add('grid');
        let title = document.createElement('a');
        title.innerHTML = item.name;
        title.classList.add('title');

        grid.appendChild(title);
        parent.appendChild(grid)
    })
})