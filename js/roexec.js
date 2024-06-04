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
                f.style.filter = 'brightness(0.2)'
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
        if (item.status === 'Trusted') {
            grid.style.borderBottom = '30px inset rgb(35 44 165 / 80%)'
        }
        let divider = document.createElement('div');
        divider.classList.add('divider');
        let last_updated = document.createElement('a');
        last_updated.innerHTML = `Last updated: ${item.last_updated}`;
        last_updated.classList.add('last_updated');

        if (item.desc === '' && item.optional != undefined) {
            let optional = document.createElement('img');
            optional.src = item.optional;
            optional.classList.add('optional');
            grid.appendChild(optional)
        }

        grid.appendChild(title);
        grid.appendChild(logo);
        grid.appendChild(platforms);
        grid.appendChild(desc);
        grid.appendChild(status);
        grid.appendChild(divider);
        grid.appendChild(last_updated)
        parent.appendChild(grid);
    })
})