const parent = document.getElementById('roexecs');
fetch('/api/roexec.json')
.then(response => response.json())
.then(data => {
    data.forEach(item => {
        let grid = document.createElement('div');
        grid.classList.add('grid');
        let title = document.createElement('a');
        title.innerHTML = item.name;
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
        if (item.status === 'In Development') {
            grid.style.borderBottom = '30px inset rgb(255 165 0 / 80%)';
        }
        if (item.status === 'Down') {
            grid.style.borderBottom = '30px inset rgb(242 63 67 / 80%)';
        }
        let divider = document.createElement('div');
        divider.classList.add('divider');
        if (item.banner != undefined) {
            let banner = document.createElement('img');
            banner.src = item.banner
            banner.classList.add('banner');
            grid.appendChild(banner);
        }
        let availability_holder = document.createElement('div');
        availability_holder.classList.add('availability-holder');
        for (let i = 0; i < item.availability.length; i++) {
            let j = item.availability[i];
            let a = document.createElement('a')
            a.innerHTML = j
            if (j == 'Free') {
                a.style.background = 'rgb(0, 200, 0)';
            }
            if (j == 'Premium') {
                a.style.backgroundImage = 'linear-gradient(to bottom right, red, yellow)';
            }
            if (j == 'Paid') {
                a.style.backgroundImage = 'linear-gradient(to bottom right, blue, white)';
            }
            availability_holder.appendChild(a);
        }
        let social_holder = document.createElement('div');
        social_holder.classList.add('social-holder');
        if (item.socials != undefined) {
            if (item.socials['discord'] != undefined) {
                let img = document.createElement('img');
                img.setAttribute('onclick', `window.open('${item.socials['discord']}')`);
                img.src = '/assets/discord.png';
                social_holder.appendChild(img);
            }
            if (item.socials['web'] != undefined) {
                let img = document.createElement('img');
                img.setAttribute('onclick', `window.open('${item.socials['web']}')`);
                img.src = '/assets/web.png';
                social_holder.appendChild(img);
            }
        }
        
        let rating_holder = document.createElement('div');
        rating_holder.classList.add('rating-holder');
        let _star = item.rating;
        if (item.rating != undefined) {
            for (let i = 0; i < 5; i++) {
                let span = document.createElement('span');
                span.classList.add('fa');
                span.classList.add('fa-star');
                if (_star >= 1) {
                    span.classList.add('star-checked')
                } else if (_star == .5) {
                    span.classList.add('star-half');
                }
                _star -= 1;
                rating_holder.appendChild(span)
            }
        } else {
            let a = document.createElement('a');
            a.innerHTML = "No review";
            rating_holder.appendChild(a);
        }
        
        let unc = document.createElement('a');
        if (item.unc != "?" && item.unc != undefined) {
            unc.innerHTML = `UNC: ${item.unc}%`;
            if (item.unc < 50) {
                unc.style.color = `rgb(255, ${item.unc*2*2.5}, 0)`
            } else {
                unc.style.color = `rgb(${(255-(item.unc*2.5))*2}, 255, 0)`
            }            
        } else {
            unc.innerHTML = "UNC: ?";
            unc.style.filter = 'brightness(0.2)'
        }
        unc.classList.add('unc');
        let last_updated = document.createElement('a');
        last_updated.innerHTML = `Last updated: ${item.last_updated}`;
        last_updated.classList.add('last_updated');

        if (item.desc === '-' && item.optional != undefined) {
            let optional = document.createElement('img');
            optional.src = item.optional;
            optional.classList.add('optional');
            grid.appendChild(optional)
        }
        if (item.desc === '') {
            desc.innerHTML = '[Please contact @aihkw to update the description]';
            desc.style.fontSize = '15px';
            desc.style.color = '#ffff00';
            desc.href = 'https://discord.com/users/640556322194063434';
        }

        grid.appendChild(title);
        grid.appendChild(logo);
        grid.appendChild(platforms);
        grid.appendChild(desc);
        grid.appendChild(status);
        grid.appendChild(divider);
        grid.appendChild(availability_holder);
        grid.appendChild(social_holder);
        grid.appendChild(rating_holder);
        grid.appendChild(unc);
        grid.appendChild(last_updated);
        parent.appendChild(grid);
    })
})