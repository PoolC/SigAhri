importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-messaging.js');

let messaging;
const config = {
  messagingSenderId: '51177059681',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
  messaging = firebase.messaging();
}

messaging.setBackgroundMessageHandler(function(payload) {
  let notificationTitle = payload.data.title;
  let notificationOptions = {
    body: payload.data.body,
    icon: 'https://api.poolc.org/files/poolc-logo.png',
    click_action: 'https://poolc.org/posts/'+ payload.data.postID,
    data: {
      postID: payload.data.postID
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
