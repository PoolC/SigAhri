importScripts('https://www.gstatic.com/firebasejs/5.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.0/firebase-messaging.js');

let messaging;
const config = {
  messagingSenderId: '51177059681'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
  messaging = firebase.messaging();
}

messaging.setBackgroundMessageHandler(function(payload) {
  let isBoard = payload.notification.title.indexOf('게시판') >= 0;
  let notificationTitle = payload.notification.title;
  let notificationOptions = {
    body: payload.notification.body,
    data: {
      boardID: payload.notification.data.boardID,
      postID: payload.notification.data.postID,
      isBoardNotification: isBoard
    }
    // TODO: icon 추가
    //icon: images
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  const postID = event.notification.data.postID;

  event.notification.close();

  let url = `http://localhost:8080/posts/${postID}`;
  event.waitUntil(
    clients.openWindow(url)
  );
});