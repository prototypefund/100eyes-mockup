/*********************************/
/*           SETUP PAGE          */
/*********************************/
(function() {
    const setupForm = document.querySelector('.setup-form');

    if(!setupForm) {
        return;
    }

    setupForm.addEventListener('submit', event => {
        event.preventDefault();
        window.localStorage.setItem('100eyes-uuid', document.querySelector('#uuid').value);
        window.localStorage.setItem('100eyes-publishKey', document.querySelector('#publishKey').value);
        window.localStorage.setItem('100eyes-subscribeKey', document.querySelector('#subscribeKey').value);
        window.location = '/';
    });
})();
