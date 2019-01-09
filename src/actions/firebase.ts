import * as firebase from 'firebase/app';
import 'firebase/messaging';
import axios from "axios";

let messaging : firebase.messaging.Messaging;

const registerToken = () => {
  messaging.getToken().then((token) => {
    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if(localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    axios({
      url: apiUrl,
      method: 'post',
      headers: headers,
      data: `mutation {
            registerPushToken(token:"${token}") {
              memberUUID
            }
          }`
    }).then((msg) => {
      // const memberUUID = msg.data.registerPushToken.memberUUID;
    }).catch((msg) => {
      console.error("error while pushing token...");
      console.error(msg);
    });
  }).catch((e) => {
    console.log(e);
  });
};

const unregisterToken = () => {
  if(messaging) {
    messaging.getToken().then((token) => {
      const headers: any = {
        'Content-Type': 'application/graphql'
      };

      if (localStorage.getItem('accessToken') !== null) {
        headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
      }

      axios({
        url: apiUrl,
        method: 'post',
        headers: headers,
        data: `mutation {
        deregisterPushToken(token:"${token}") {
          memberUUID
        }
      }`
      }).then((msg) => {
        // const memberUUID = msg.data.deregisterPushToken.memberUUID;
        messaging.deleteToken(token);
      }).catch((msg) => {
        console.error("error while pushing token...");
        console.error(msg);
      });
    }).catch((e) => {
      console.log("설정 해제할 토큰이 없습니다.");
    });
  } else {
    console.log("messaging is not defined.");
  }
};

const initializeFCM = () => {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: process.env.apiKey,
        authDomain: process.env.authDomain,
        databaseURL: process.env.databaseURL,
        projectId: process.env.projectId,
        storageBucket: process.env.storageBucket,
        messagingSenderId: process.env.messagingSenderId
      });
      messaging = firebase.messaging();
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        let isRegistrated: boolean = false;
        let registration: ServiceWorkerRegistration;
        registrations.forEach((reg, idx) => {
          if (reg.active.scriptURL.search("firebase-messaging-sw.js") >= 0 && reg.active.state === "activated"
            && reg.scope.search("firebase-cloud-messaging-push-scope") < 0) {
            isRegistrated = true;
            registration = reg;
          }
        });

        if (!isRegistrated) {
          navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then(function (reg) {
              messaging.useServiceWorker(reg);
              registration = reg;
            })
        }

        return registration;
      }).then((registration: ServiceWorkerRegistration) => {
        messaging.requestPermission()
          .then(() => {
            registerToken();

            messaging.onTokenRefresh(function () {
              registerToken();
            });

            messaging.onMessage(function (payload) {
              var notificationTitle = payload.notification.title;
              var notificationOptions = {
                body: payload.notification.body,
                //TODO: poolc logo 추가
                //icon: poolc_logo
              };

              registration.showNotification(notificationTitle, notificationOptions);
            });
          })
          .catch((e) => {
            console.log("알림 설정을 거절하였습니다");
            console.log(e);
          })
      }).catch(function (err) {
        console.log('Service worker registration failed, error:', err);
      });
    }
  } catch(e) {
    console.error("Error while initializing Firebase\n" + e);
  }
};

const getToken = () => {
  messaging.getToken().then((token) => {
    return token;
  });
};

const FCM = {
  registerToken: registerToken,
  unregisterToken: unregisterToken,
  initializeFCM: initializeFCM,
  getToken: getToken
};
export default FCM;