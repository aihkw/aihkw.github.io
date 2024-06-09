var fortnite_servers;
var test_websites;
var count = 0;
var result = [];
var final_result = [];
var running = false;
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
    running = true;
    Promise.all(fortnite_servers.map(server => {
        let start2 = performance.now();
        ajax(server.url, function() {
            var delay = performance.now()-start2;
            let server_name = server.url.split('.')[1];
            result.push([server_name, delay])
            terminal_output.innerHTML = `(${result.length}/${count}) Analyzing ${server_name}...`;
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
                ping.setAttribute('id', arr[0])
                ping.classList.add('ping');
                if (arr[1] < 100) {
                    ping.style.color = `rgb(${arr[1]*2}, 255, 0)`;
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
                    terminal_output.innerHTML = `(${result.length}/${count}) Looping for accuracy`;
                    terminal_output.removeAttribute('style');
                    start_btn.innerHTML = 'Stop';
                }
            })
            final_result = [];
            let loop = setInterval(()=>{
                if (running) {
                    var _start = performance.now();
                    ajax(server.url, function() {
                        var _end = performance.now()-_start;
                        if (_end < 100) {
                            document.querySelector(`#${server_name}`).style.color = `rgb(${_end*2}, 255, 0)`;
                        } else {
                            document.querySelector(`#${server_name}`).style.color = `rgb(255, ${(255-(_end*1))*2}, 0)`;
                        }
                        document.querySelector(`#${server_name}`).innerHTML = `${_end}ms`;
                    })
                } else {
                    clearInterval(loop)
                }
            }, 1000)
        });
    }));
}


function ajax(a, b, c) {
    c = new XMLHttpRequest;
    c.open('GET', a);
    c.onload = b;
    c.send()
}

start_btn.addEventListener('click', async function () {
    if (!running) {
        running = true
        start_btn.innerHTML = 'Pinging Fortnite servers <img height="70" width="70" src="/assets/loading.gif"  alt="Loading" style="display: inline; vertical-align: middle;" />';
        await start_test();
        start_btn.classList.add('stop');
    } else {
        start_btn.classList.remove('stop');
        running = false;
        start_btn.innerHTML = 'Run test'
    }
    
});