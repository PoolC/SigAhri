<template>
  <div id="app">
    <Header/>
    <router-view v-if="stateReady"/>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  data() {
    return {
      stateReady: false,
    };
  },
  components: {
    Header,
    Footer,
  },
  created() {
    this.$api.request({
      data: `mutation {
        refreshAccessToken {
          key
        }
      }`,
    }).then((res) => {
      if (!('errors' in res.data)) {
        const token = res.data.data.refreshAccessToken.key;
        this.$store.dispatch('refresh', token).then(() => {
          this.stateReady = true;
        });
      } else {
        this.$store.dispatch('init').then(() => {
          this.stateReady = true;
        });
      }
      console.log('hi');
    });
  },
};
</script>

<style>

</style>
