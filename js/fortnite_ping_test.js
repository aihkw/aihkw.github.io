var fortnite_servers;
var test_websites;
var count = 0;
var result = [];
var final_result = [];
const start_btn = document.querySelector('#start_btn');
const terminal_output = document.getElementById('terminal_output');
const results_container = document.querySelector('.results-container');
fetch('/api/fortnite_ping_test.json')
.then(response => response.json())
.then(data => {
    fortnite_servers = data.fortnite_servers;
    test_websites = data.test_websites;
    count = fortnite_servers.length;
});

//
async function start_test() {
    let start = performance.now();
    result = [];
    final_result = [];
    results_container.innerHTML = '';
    for (const server of fortnite_servers) {
        let start2 = performance.now();
        ajax(server.url, function() {
            var delay = performance.now()-start2;
            result.push([server.url.split('.')[1], delay])
            terminal_output.innerHTML = `(${result.length}/${count}) Analyzing ${server.url.split('.')[1]}...`;
            terminal_output.setAttribute('style', `background: linear-gradient(120deg, green ${(result.length/count)*100}%, rgb(26, 26, 26) 0%) !important`)

            results_container.innerHTML = '';
            for (let i = 0; i < result.length; i++) {
                final_result.push([result[i][0], result[i][1]]);
            }
            final_result.sort((a, b) => a[1] - b[1]);
            final_result.forEach(arr => {
                let div = document.createElement('div');
                div.classList.add('result');
                let dns_name = document.createElement('a');
                dns_name.innerHTML = arr[0];
                dns_name.classList.add('dns-name');
                let ping = document.createElement('span');
                ping.innerHTML = `${arr[1]}ms`;
                ping.classList.add('ping');
                if (arr[1] < 250) {
                    ping.style.color = `rgb(${arr[1]*2*1}, 255, 0)`;
                } else {
                    ping.style.color = `rgb(255, ${(255-(arr[1]*1))*2}, 0)`;
                }
                let img = document.createElement('img');
                img.src = `/assets/earth.png`;
                
                dns_name.appendChild(ping);
                dns_name.appendChild(img);
                div.appendChild(dns_name);
                results_container.appendChild(div);
                if (result.length == count) {
                    terminal_output.innerHTML = `(${result.length}/${count}) Finished (${(performance.now()-start)/1000}s)`;
                    terminal_output.removeAttribute('style');
                    start_btn.innerHTML = 'Run test';
                    start_btn.disabled = false;
                }
            })
            final_result = [];
        });
    }
}

function ajax(a, b, c) {
    c = new XMLHttpRequest;
    c.open('GET', a);
    c.onload = b;
    c.send()
}

start_btn.addEventListener('click', async function () {
    this.disabled = true;
    start_btn.innerHTML = 'Pinging Fortnite servers <img height="70" width="70" src="/assets/loading.gif"  alt="Loading" style="display: inline; vertical-align: middle;" />';
    await start_test();
});