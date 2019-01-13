importScripts('https://www.gstatic.com/firebasejs/5.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.0/firebase-messaging.js');

let messaging;
const config = {
  messagingSenderId: "51177059681"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
  messaging = firebase.messaging();
}

messaging.setBackgroundMessageHandler(function(payload) {
  var notificationTitle = payload.notification.title;
  var notificationOptions = {
    body: payload.notification.body,
    // TODO: icon 추가
    //icon: images
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});