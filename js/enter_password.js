var input = document.querySelector('.input-field');
var label = document.querySelector('.input-label')
var count = -1;
const ins = [
    'incorrect',
    'again',
    'again later',
    'me',
    'bruh',
]
const res = [
    'Password is incorrect',
    'Try again',
    'Please try again later',
    'Don\'t try me',
    'I dare you repeat bruh',
    '_rr',
]
var hint = false;
var tries = 0;

input.addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        let v = input.value.toLowerCase();
        input.value = '';
        if (v === '') {
            label.textContent = 'Fill in the blank';
            if (count >= 0) {
                label.textContent = `Fill in the blank, ${res[count].toLowerCase()}`
            }
            label.classList.add('red');
            label.classList.remove('blue');
            document.querySelector('.input-highlight').classList.add('redbg');
            return
        } else if (v != res[count]) {
            label.textContent = res[count];
            if (!hint && tries > 0) {
                alert("Hint: listen to what it says")
                hint = true;
            }
            tries++
        }
        if (count === -1) {
            count++;
            label.innerHTML = res[count];
            label.classList.add('red');
            label.classList.remove('blue');
            document.querySelector('.input-highlight').classList.add('redbg');
            return
        }
        if (v === ins[count]) {
            count++;
            label.innerHTML = res[count];
        }
        if (res[count] === '_rr') {
            input.remove();
            label.remove();
            let vid = document.querySelector('video');
            vid.classList.add('here-it-goes')
            let src = document.querySelector('source');
            src.src = '/assets/rr.mp4';
            vid.play();
            vid.requestFullscreen();
            return
        }
    }
});