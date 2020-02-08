<template>
  <div>
    <footer>
      <div>
        <img :src="logo" alt="풀씨 로고" />
        <h4>CONTACT</h4>
        <p><i class="fas fa-map-marker-alt"/>연세대학교 제1공학관 537호</p>
        <p><i class="far fa-envelope"/>poolc.official@gmail.com</p>
        <p><i class="fas fa-phone"/>회장 {{ president.name }} {{ president.phone }} </p>
      </div>
      <div>
        <p>회원가입은 매 학기 초마다 지정된 시기에 받고 있습니다.</p>
        <p>프로그래밍에 관심이 있는 모든 학우분들의 연락을 환영합니다.</p>
        <p>구인/홍보 문의는 이메일로 연락주시기 바랍니다.</p>
        <p>ⓒ {{ (new Date()).getFullYear() }} All Rights Reserved. PoolC</p>
        <a href="http://poolc.github.io/Regulation/" target="_blank">동아리 회칙</a>
        <a href="https://github.com/PoolC" target="_blank">GitHub</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      logo: 'https://api.poolc.org/files/poolc-logo.png',
      president: {
        name: '양정일',
        phone: '010-2862-6046',
      },
    };
  },
};
</script>

<style scoped>
a {
  @apply mx-2;
}
</style>
