<template>
  <div>
    <nav>
      <router-link to="/">PoolC</router-link>
      <div>
        <ul>
          <router-link v-for="link of leftLinks" :key="link.name" :to="link.link">
            {{ link.name }}
          </router-link>
        </ul>
        <ul>
          <router-link to="/admin" v-if="$store.state.isAdmin">
            관리자
          </router-link>

          <router-link to="/info" v-if="$store.state.isLogin">
            내 정보
          </router-link>
          <router-link to="/register" v-else>
            가입 신청
          </router-link>

          <button v-if="$store.state.isLogin" @click="$store.dispatch('logoutRequest')">
            로그아웃
          </button>
          <router-link to="/login" v-else>
            로그인
          </router-link>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      leftLinks: [
        {
          name: '게시판',
          link: '/board/notice',
        },
        {
          name: '프로젝트',
          link: '/project',
        },
        {
          name: '학술부',
          link: '/study',
        },
      ],
    };
  },
};
</script>

<style scoped>

</style>
