var dns_servers;
var test_websites;
var count = 0;
var result = [];
var final_result = [];
const start_btn = document.querySelector('#start_btn');
const terminal_output = document.getElementById('terminal_output');
const results_container = document.querySelector('.results-container');
fetch('/api/dns_speed_test.json')
.then(response => response.json())
.then(data => {
    dns_servers = data.dns_servers;
    test_websites = data.test_websites;
    count = dns_servers.length;
});

async function warm_up() {
    const promises = dns_servers.map(server => Promise.all(test_websites.map(website => measure_dns_speed(server.url, website, server.type, server.allowCors))));
    await Promise.all(promises);
}

//
async function start_test() {
    let start = performance.now();
    result = [];
    final_result = [];
    results_container.innerHTML = '';
    for (const server of dns_servers) {
        const speed_results = await Promise.all(test_websites.map(website => measure_dns_speed(server.url, website, server.type, server.allowCors)));
        server.individualResults = test_websites.map((website, index) => {
            const speed = speed_results[index];
            return {website, speed: speed !== undefined ? speed : undefined};
        });
        const valid_results = speed_results.filter(speed => speed !== null && typeof speed === 'number');
        valid_results.sort((a, b) => a - b);
        if (valid_results.length > 0) {
            const min = valid_results[0];
            const max = valid_results[valid_results.length - 1];
            const median = valid_results.length % 2 === 0 ? (valid_results[valid_results.length / 2 - 1] + valid_results[valid_results.length / 2]) / 2 : valid_results[Math.floor(valid_results.length / 2)];
            server.speed = {min, median, max};
        } else {
            server.speed = {min: undefined, median: undefined, max: undefined};
        }
        result.push(server);
        terminal_output.innerHTML = `(${result.length}/${count}) Analyzing ${server.name}...`;
        terminal_output.setAttribute('style', `background: linear-gradient(120deg, green ${(result.length/count)*100}%, rgb(26, 26, 26) 0%) !important`)

        results_container.innerHTML = '';
        for (let i = 0; i < result.length; i++) {
            final_result.push([result[i].name, result[i].speed.min, result[i].speed.median, result[i].speed.max]);
        }
        final_result.sort((a, b) => a[1] - b[1]);
        final_result.forEach(arr => {
            let div = document.createElement('div');
            div.classList.add('result');
            let dns_name = document.createElement('a');
            dns_name.innerHTML = arr[0];
            dns_name.classList.add('dns-name');
            let ping = document.createElement('span');
            ping.innerHTML = `${arr[1]}ms<span>,</span> ${arr[2]}ms<span>,</span> ${arr[3]}ms`;
            ping.classList.add('ping');
            if (arr[1] < 100) {
                ping.style.color = `rgb(${arr[1]*2*2.5}, 255, 0)`;
            } else {
                ping.style.color = `rgb(255, ${(255-(arr[1]*1))*2}, 0)`;
            }
            let img = document.createElement('img');
            try {
                img.src = `/assets/${arr[0].toLowerCase()}.png`;
            } catch {
                img.src = '/assets/placeholder.png';
            }
            
            dns_name.appendChild(ping);
            dns_name.appendChild(img);
            div.appendChild(dns_name);
            results_container.appendChild(div)
        })
        final_result = [];
    }
    terminal_output.innerHTML = `(${result.length}/${count}) Finished (${(performance.now()-start)/1000}s)`;
    terminal_output.removeAttribute('style');
}

async function measure_dns_speed(url, hostname, serverType = 'post', allowCors = false) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
    try {
        const startTime = performance.now();
        let response;
        if (serverType === 'get') {
            const urlWithParam = new URL(url);
            urlWithParam.searchParams.append('name', hostname);
            urlWithParam.searchParams.append('nocache', Date.now());
            let fetchOptions = {
                method: 'GET', signal: controller.signal
            };
            if (allowCors) {
                fetchOptions.headers = {'Accept': 'application/dns-json'};
            } else {
                fetchOptions.mode = 'no-cors';
            }
            response = await fetch(urlWithParam, fetchOptions);
        } else {
            const dnsQuery = buildDNSQuery(hostname);
            let fetchOptions = {
                method: 'POST', body: dnsQuery, mode: allowCors ? 'cors' : 'no-cors', signal: controller.signal
            };
            if (allowCors) {
                fetchOptions.headers = {'Content-Type': 'application/dns-message'};
            }
            response = await fetch(url, fetchOptions);
        }
        clearTimeout(timeoutId);

        if (allowCors && !response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const endTime = performance.now();
        return endTime - startTime;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError' || error.message === 'NS_BINDING_ABORTED') {
            console.error('Request timed out or was aborted');
        } else {
            console.error('Error during DNS resolution:', error);
        }
        return null;
    }
}

function buildDNSQuery(hostname) {
    const header = new Uint8Array([0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const labels = hostname.split('.');
    const question = labels.flatMap(label => {
        const length = label.length;
        return [length, ...Array.from(label).map(c => c.charCodeAt(0))];
    });
    const typeAndClass = new Uint8Array([0x00, 0x01, 0x00, 0x01]);
    const query = new Uint8Array(header.length + question.length + 2 + typeAndClass.length);
    query.set(header);
    query.set(question, header.length);
    query.set([0x00], header.length + question.length); // Null byte to end the QNAME
    query.set(typeAndClass, header.length + question.length + 1);
    return query;
}

start_btn.addEventListener('click', async function () {
    this.disabled = true;
    start_btn.innerHTML = 'Warming up <img height="70" width="70" src="/assets/loading.gif"  alt="Loading" style="display: inline; vertical-align: middle;" />';
    await warm_up();
    start_btn.innerHTML = 'Analyzing DNS servers <img height="70" width="70" src="/assets/loading.gif" alt="Loading" style="display: inline; vertical-align: middle;" />';
    await start_test();
    start_btn.querySelector('img').remove();
    start_btn.innerHTML = 'Run test';
    this.disabled = false;
});