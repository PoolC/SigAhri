<template>
  <div id="app">
    <Header/>
    <router-view/>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
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
        this.$store.dispatch('refresh', token);
      } else {
        this.$store.dispatch('init');
      }
    });
  },
};
</script>

<style>

</style>
