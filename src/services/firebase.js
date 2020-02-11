import * as firebase from 'firebase/app';
import 'firebase/messaging';
import axios from 'axios';

let messaging;

const api = axios.create({
  baseURL: 'https://api.poolc.org/graphql',
  method: 'POST',
  timeout: 1500,
});

const initialize = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: 'AIzaSyBK1t6E78of6CMo9KVLi5ZukrPAwAgmd_c',
      authDomain: 'poolc-b18fa.firebaseapp.com',
      databaseURL: 'https://poolc-b18fa.firebaseio.com',
      projectId: 'poolc-b18fa',
      storageBucket: 'poolc-b18fa.appspot.com',
      messagingSenderId: '51177059681',
      appId: '1:51177059681:web:7afccf9834fb544c1c8120',
    });
    messaging = firebase.messaging();
  }
};

const registerToken = (messagingToken) => {
  api.request({
    data: `mutation {
      registerPushToken(token:"${messagingToken}") {
        memberUUID
      }
    }`,
    headers: {
      'Content-Type': 'application/graphql',
      Authentication: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
};

const register = async () => {
  initialize();

  if (!('serviceWorker' in navigator)) return;
  if (!('Notification' in window)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  let registration = null;
  registrations.forEach((reg) => {
    if (reg.active.scriptURL.search('firebase-messaging-sw.js') >= 0 && reg.active.state === 'activated') {
      registration = reg;
    }
  });

  if (registration) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js').then((reg) => {
      registration = reg;
    });
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        // eslint-disable-next-line no-new
        new Notification('알림이 설정되었습니다');
      }
    });
  }
  messaging.useServiceWorker(registration);

  const messagingToken = await messaging.getToken();
  registerToken(messagingToken);

  messaging.onTokenRefresh(() => {
    registerToken(messagingToken);
  });
  messaging.onMessage((payload) => {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon: 'https://api.poolc.org/files/poolc-logo.png',
      data: {
        postID: payload.data.postID,
      },
    };

    registration.showNotification(notificationTitle, notificationOptions);
  });
};

const unregister = async () => {
  if (!messaging) return;

  const messagingToken = await messaging.getToken();
  api.request({
    data: `mutation {
      deregisterPushToken(token:"${messagingToken}") {
        memberUUID
      }
    }`,
    headers: {
      'Content-Type': 'application/graphql',
      Authentication: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  messaging.deleteToken(messagingToken);
};

export default {
  register,
  unregister,
};
