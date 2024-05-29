const parent = document.getElementById('roexecs');
fetch('/api/roexec.json')
.then(response => response.json())
.then(data => {
    data.forEach(item => {
        let grid = document.createElement('div');
        grid.classList.add('grid');
        let title = document.createElement('a');
        title.innerHTML = item.name;
        title.href = item.url
        title.classList.add('title');
        let logo = document.createElement('img');
        logo.src = item.logo
        logo.classList.add('logo');
        let platforms = document.createElement('div');
        platforms.classList.add('platforms');
        item.platforms.forEach(e => {
            let f = document.createElement('img');
            if (e === 'Windows' || e === 'Windows!') {
                f.src = '/assets/windows.webp';
            }
            if (e === 'Mac' || e === 'Mac!') {
                f.src = '/assets/ios.webp';
            }
            if (e === 'Android' || e === 'Android!') {
                f.src = '/assets/android.webp';
            }
            if (e === 'iOS' || e === 'iOS!') {
                f.src = '/assets/ios.webp';
            }

            if (e.slice(-1) === '!') {
                f.style.filter = 'brightness(0.1)'
            }
            platforms.appendChild(f);
        });
        let desc = document.createElement('a');
        desc.innerHTML = item.desc;
        desc.classList.add('desc');
        let status = document.createElement('a');
        status.innerHTML = item.status;
        status.classList.add('status');
        if (item.status === 'Offline' || item.status === 'Discontinued') {
            grid.style.borderBottom = '#000 30px inset';
        }
        if (item.status === 'Operational') {
            grid.style.borderBottom = '#23A55A 30px inset';
        }
        if (item.status === 'Fixing') {
            grid.style.borderBottom = '30px inset rgb(240 178 50 / 80%)';
        }
        if (item.status === 'Down') {
            grid.style.borderBottom = '30px inset rgb(242 63 67 / 80%)';
        }

        grid.appendChild(title);
        grid.appendChild(logo);
        grid.appendChild(platforms);
        grid.appendChild(desc);
        grid.appendChild(status);
        parent.appendChild(grid);
    })
})
