/*********************************/
/*       VERIFY CREDENTIALS      */
/*********************************/
(function() {
    // Try to read PubNub keys and UUID from local storage
    window.uuid = window.localStorage.getItem('100eyes-uuid');
    window.publishKey = window.localStorage.getItem('100eyes-publishKey');
    window.subscribeKey = window.localStorage.getItem('100eyes-subscribeKey');

    window.publishValid = window.publishKey && window.publishKey.startsWith('pub-');
    window.subscribeValid = window.subscribeKey && window.subscribeKey.startsWith('sub-');
    window.uuidValid = !!uuid;

    // Redirect to setup page if missing or invalid
    if(!(window.publishValid && window.subscribeValid && window.uuidValid)) {
        window.location = '/setup.html';
    }
})();


/*********************************/
/*       INITIALIZE PUBNUB       */
/*********************************/
(function() {
    // Initialize PubNub client and make it globally available
    window.pubnub = new PubNub({
        publishKey: window.publishKey,
        subscribeKey: window.subscribeKey,
        uuid: window.uuid,
    });

    window.pubnub.subscribe({ channels: ['replies', 'here', 'question'] });

    // Announce presence on the `here` channel
    window.pubnub.publish({ channel: 'here', message: 'connected' });
})(PubNub);


/*********************************/
/*     LIVE QUESTION UPDATES     */
/*********************************/
(function() {
    const questionForm = document.querySelector('.question-form');

    if(!questionForm) {
        return;
    }

    // Broadcast the question as the user types
    questionForm.question.addEventListener('input', event => {
        window.pubnub.publish({
            channel: 'question',
            message: {
                question: event.target.value,
            },
        });
    });
})();


/*********************************/
/*          SHOW REPLIES         */
/*********************************/
(function() {
    const repliesWrapper = document.querySelector('.replies');

    if(!repliesWrapper) {
        return;
    }

    const replies = [];

    const renderReplies = () => {
        const items = [ ...replies ];
        items.reverse();

        const html = items
            .map(({ from, text, via }) => `
                <div class="reply">
                    <strong>${ from }</strong> ${ via ? 'via ' + via : '' }
                    <p>${ text }</p>
                </div>
            `)
            .join('');

        repliesWrapper.innerHTML = html;
    };

    renderReplies();

    window.pubnub.addListener({
        message: event => {
            if(event.channel !== 'replies') {
                return;
            }

            replies.push(event.message);
            renderReplies();
        },
    });
})();


/*********************************/
/*       SHOW REPLY COUNT        */
/*********************************/
(function() {
    const countWrapper = document.querySelector('.count');

    if(!countWrapper) {
        return;
    }

    const replies = [];

    const renderCount = () => {
        if(replies.length <= 0) {
            countWrapper.innerHTML = `Bisher hat noch niemand geantwortet. Neue Antworten erscheinen hier automatisch.`;
            return;
        }

        countWrapper.innerHTML = `
            Bisher haben <strong>${ replies.length } von 50 Personen</strong> geantwortet.
            Neue Antworten erscheinen hier automatisch.
        `;
    }

    renderCount();

    window.pubnub.addListener({
        message: event => {
            if(event.channel !== 'reply') {
                return;
            }

            replies.push(event.message);
            renderCount();
        },
    });
})();


/*********************************/
/*  COCKPIT – CONNECTION STATUS  */
/*********************************/
(function() {
    const connectionWrapper = document.querySelector('.cockpit-connection');

    if(!connectionWrapper) {
        return;
    }

    const connectedUsers = new Set();

    const renderConnection = () => {
        if(connectedUsers.size <= 0) {
            connectionWrapper.innerHTML = 'Es hat sich noch niemand verbunden.';
            return;
        }

        connectionWrapper.innerHTML = `
            ${connectedUsers.size} verbundene Nutzer: ${ Array.from(connectedUsers).join(', ') }
        `;
    };

    window.pubnub.addListener({
        message: event => {
            if(event.channel !== 'here') {
                return;
            }

            connectedUsers.add(event.publisher);
            renderConnection();
        },
    });
})();


/*********************************/
/*    COCKPIT - LIVE QUESTION    */
/*********************************/
(function() {
    const questionWrapper = document.querySelector('.cockpit-question');

    if(!questionWrapper) {
        return;
    }

    let question = null;

    const renderQuestion = () => {
        if(!question) {
            questionWrapper.innerHTML = 'Die Testperson hat noch keine Frage eingegeben.';
            return;
        }

        questionWrapper.innerHTML = question;
    };

    renderQuestion();

    window.pubnub.addListener({
        message: event => {
            if(event.channel !== 'question') {
                return;
            }

            question = event.message.question;
            renderQuestion();
        },
    });
})();


/*********************************/
/*    COCKPIT - PUBLISH REPLY    */
/*********************************/
(function() {
    const publishForm = document.querySelector('.cockpit-publish-form');

    if(!publishForm) {
        return;
    }

    const publishMessage = () => {
        window.pubnub.publish({
            channel: 'replies',
            message: {
                from: publishForm.from.value,
                via: publishForm.via.value,
                text: publishForm.text.value,
            },
        });

        publishForm.reset();
        publishForm.from.focus();
    };

    publishForm.addEventListener('submit', event => {
        event.preventDefault();
        publishMessage();
    });
})();
