<template>
  <div>
    <h1>로그인</h1>
    <input-box label="아이디" @change="userInput.id = $event" />
    <input-box type="password" label="비밀번호" @change="userInput.pw = $event" />
    <my-button @click="login">로그인</my-button>
    <div>
      <p>계정이 없으신 분은 우선
        <router-link to="/register">가입신청</router-link>
        을 해주세요.
      </p>
      <p>비밀번호를 잊으셨나요?
        <router-link to="/accounts/password-reset">비밀번호 찾기</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import InputBox from '@/components/InputBox.vue';
import MyButton from '@/components/MyButton.vue';

export default {
  name: 'Login',
  data() {
    return {
      userInput: {
        id: '',
        pw: '',
      },
    };
  },
  components: {
    InputBox,
    MyButton,
  },
  methods: {
    login() {
      this.$store.dispatch('loginRequest', {
        id: this.userInput.id,
        pw: this.userInput.pw,
      });
    },
  },
};
</script>

<style scoped>

</style>
