importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-messaging.js');

let messaging;
const config = {
  messagingSenderId: '51177059681'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
  messaging = firebase.messaging();
}

messaging.setBackgroundMessageHandler(function(payload) {
  let notificationTitle = payload.notification.title;
  let notificationOptions = {
    body: payload.notification.body,
    icon: 'https://api.poolc.org/files/poolc-logo.png',
    click_action: 'https://poolc.org/posts/'+ payload.notification.data.postID,
    data: {
      postID: payload.notification.data.postID
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  const postID = event.notification.data.postID;

  event.notification.close();

  let url = 'https://poolc.org/posts/' + postID;
  event.waitUntil(
    clients.openWindow(url)
  );
});