import * as firebase from 'firebase/app';
import 'firebase/messaging';
import myGraphQLAxios from "../utils/ApiRequest";

let messaging : firebase.messaging.Messaging;

const registerToken = () => {
  messaging.getToken().then((firebaseToken) => {
    const data = `mutation {
      registerPushToken(token:"${firebaseToken}") {
        memberUUID
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
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
    messaging.getToken().then((firebaseToken) => {
      const data = `mutation {
        deregisterPushToken(token:"${firebaseToken}") {
          memberUUID
        }
      }`;

      myGraphQLAxios(data, {
        authorization: true
      }).then((msg) => {
        // const memberUUID = msg.data.deregisterPushToken.memberUUID;
        messaging.deleteToken(firebaseToken);
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
          if (reg.active.scriptURL.search("sw.js") >= 0 && reg.active.state === "activated") {
            isRegistrated = true;
            registration = reg;
          }
        });

        if (!isRegistrated) {
          navigator.serviceWorker.register('/sw.js')
            .then(function (reg) {
              registration = reg;
            })
        }

        return registration;
      }).then((registration: ServiceWorkerRegistration) => {
        messaging.requestPermission()
          .then(() => {
            messaging.useServiceWorker(registration);
            registerToken();

            messaging.onTokenRefresh(function () {
              registerToken();
            });
            messaging.onMessage(function (payload) {
              let notificationTitle = payload.data.title;
              let notificationOptions = {
                body: payload.data.body,
                icon: logoUrl,
                data: {
                  postID: payload.data.postID
                },
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