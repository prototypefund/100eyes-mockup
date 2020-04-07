/*********************************/
/*             MISC              */
/*********************************/

// Speed up page transitions
(function() {
    window.addEventListener('load', () => quicklink.listen());
})(quicklink);

// Autoresize textareas to fit contents
(function() {
    const textarea = document.querySelector('textarea');

    if(textarea) {
        const offset = textarea.offsetHeight - textarea.clientHeight;
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = event.target.scrollHeight + offset + 'px';
        });
    }
})();

// Show loading indicator on form submit
(function() {
    const form = document.querySelector('form');
    const submit = document.querySelector('button[type="submit"][data-loading-indicator]');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" stroke-width="2"><g stroke-width="2" transform="translate(0, 0)"><path fill="none" stroke="#ffffff" stroke-width="2" stroke-miterlimit="10" d="M1.96,16.5C1.343,15.127,1,13.603,1,12 C1,5.925,5.925,1,12,1s11,4.925,11,11s-4.925,11-11,11c-2.651,0-5.082-0.938-6.982-2.499" data-cap="butt" stroke-linecap="butt" stroke-linejoin="miter"></path> </g></svg>'

    if(!form || !submit) {
        return;
    }

    // Show loading indicator on submit
    form.addEventListener('submit', () => {
        submit.disabled = true;
        submit.innerHTML = svg;
    });
})();
