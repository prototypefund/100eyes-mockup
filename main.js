/* Quicklink */
window.addEventListener('load', () => quicklink.listen());

/* Autoresize */
const textarea = document.querySelector('textarea');

if(textarea) {
    const offset = textarea.offsetHeight - textarea.clientHeight;
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = event.target.scrollHeight + offset + 'px';
    });
}

/* Disable submit button */
const form = document.querySelector('form');
const submit = document.querySelector('input[type="submit"]');

if(form && submit) {
    form.addEventListener('submit', () => {
        submit.disabled = true;
        submit.value = 'Sende Frage…';
    });
}
