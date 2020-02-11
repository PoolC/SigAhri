<template>
  <div>
    <h1>
      비밀번호 찾기
    </h1>
    <p>
      가입할 때 입력한 이메일을 입력해 주세요
    </p>
    <input-box placeholder="예) poolc.official@gmail.com"/>
    <my-button>초기화 메일 전송</my-button>
  </div>
</template>

<script>
import InputBox from '@/components/InputBox.vue';
import MyButton from '@/components/MyButton.vue';

export default {
  name: 'PasswordReset',
  components: {
    MyButton,
    InputBox,
  },
};
</script>

<style scoped>

</style>
