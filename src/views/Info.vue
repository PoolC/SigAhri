<template>
  <div>
    <h1>내 정보</h1>
    <input-box label="아이디" type="text" disabled="true" :value="me.loginID"/>
    <input-box label="새 비밀번호" type="password"
               placeholder="8자리 이상" @change="me.password = $event"/>
    <input-box label="새 비밀번호 확인" type="password"
               placeholder="위에서 입력한 비밀번호와 동일하게"
               @change="me.pwConfirm = $event"/>
    <input-box label="이름" type="text" disabled="true" :value="me.name"/>
    <input-box label="이메일" type="text" placeholder="예) poolc.official@gmail.com"
               :value="me.email" @change="me.email = $event"/>
    <input-box label="전화번호" type="text" placeholder="예) 010-1234-5678"
               :value="me.phoneNumber" @change="me.phoneNumber = $event"/>
    <input-box label="소속학과" type="text"
               :value="me.department" @change="me.department = $event"/>
    <input-box label="학번" type="text" disabled="true" :value="me.studentID"/>
    <my-button @click="updateInfo">
      정보 수정
    </my-button>
  </div>
</template>

<script>
import InputBox from '@/components/InputBox.vue';
import MyButton from '@/components/MyButton.vue';

export default {
  name: 'Info',
  components: {
    MyButton,
    InputBox,
  },
  data() {
    return {
      me: {
        loginID: '',
        password: '',
        pwConfirm: '',
        name: '',
        email: '',
        department: '',
        studentID: '',
        phoneNumber: '',
      },
    };
  },
  created() {
    this.$api.request({
      data: `query {
        me {
          loginID, name, email, phoneNumber,
          department, studentID
        }
      }`,
    }).then((res) => {
      if ('errors' in res.data) {
        alert('다시 로그인 해주세요');
        this.$router.push('/');
      }
      this.me = res.data.data.me;
    });
  },
  methods: {
    updateInfo() {
      if (this.password && (this.password.length < 8 || this.password.length > 255)) {
        alert('비밀번호는 8자리 이상으로 255자리 이하로 설정해 주세요');
        return;
      }
      if (this.password !== this.pwConfirm) {
        alert('비밀번호와 비밀번호(확인)이 일치하지 않습니다');
        return;
      }
      if (this.email.length === 0) {
        alert('이메일을 적어주세요');
        return;
      }
      if (!(/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.email.toLowerCase())) {
        alert('이메일 형식을 맞춰주세요');
        return;
      }
      if (this.email.length > 255) {
        alert('이메일이 너무 깁니다');
        return;
      }
      if (!(/^\d{3}-\d{3,4}-\d{4}$/).test(this.phoneNumber)) {
        alert('휴대폰 번호를 다시 한번 확인해주세요');
        return;
      }
      if (!this.department) {
        alert('소속학과를 적어주세요');
        return;
      }

      this.$api.request({
        data: `mutation {
          updateMember(MemberInput: {
            email: "${this.email}",
            phoneNumber: "${this.phoneNumber}",
            department: "${this.department}",
            ${this.password && `password: "${this.password}"`}
          }) {
            uuid
          }
        }`,
      }).then((res) => {
        if ('errors' in res.data) {
          alert('실패하였습니다. 회장에게 문의해 주세요');
          return;
        }

        alert('수정되었습니다');
      });
    },
  },
};
</script>

<style scoped>

</style>
