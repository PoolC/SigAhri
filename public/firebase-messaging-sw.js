importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-messaging.js');
var firebaseConfig = {
  apiKey: "AIzaSyBK1t6E78of6CMo9KVLi5ZukrPAwAgmd_c",
  authDomain: "poolc-b18fa.firebaseapp.com",
  databaseURL: "https://poolc-b18fa.firebaseio.com",
  projectId: "poolc-b18fa",
  storageBucket: "poolc-b18fa.appspot.com",
  messagingSenderId: "51177059681",
  appId: "1:51177059681:web:7afccf9834fb544c1c8120"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

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
