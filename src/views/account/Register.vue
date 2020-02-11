<template>
  <div>
    <h1>가입 신청</h1>
    <input-box label="아이디"
               placeholder="영/숫자 4~12자리"
               @change="id=$event"/>
    <input-box label="비밀번호"
               placeholder="8자리 이상"
               @change="pw=$event"/>
    <input-box label="비밀번호 (확인)"
               placeholder="8자리 이상"
               @change="pwConfirm=$event"/>
    <input-box label="이름"
               placeholder="홍길동"
               @change="name=$event"/>
    <input-box label="이메일"
               placeholder="예) poolc.official@gmail.com"
               @change="email=$event"/>
    <input-box label="전화번호"
               placeholder="010-1234-5678"
               @change="phone=$event"/>
    <input-box label="소속학과"
               placeholder="0000학과"
               @change="department=$event"/>
    <input-box label="학번"
               placeholder="2020100000"
               @change="studentID=$event"/>
    <my-button @click="register">
      회원가입
    </my-button>
  </div>
</template>

<script>
import InputBox from '@/components/InputBox.vue';
import MyButton from '@/components/MyButton.vue';

export default {
  name: 'Register',
  components: {
    InputBox,
    MyButton,
  },
  data() {
    return {
      id: '',
      pw: '',
      pwConfirm: '',
      name: '',
      email: '',
      phone: '',
      department: '',
      studentID: '',
    };
  },
  methods: {
    register() {
      if (!(/^[A-Za-z0-9+]{4,12}$/).test(this.id)) {
        alert('아이디는 영문/숫자 4~12자리로 설정해주세요.');
        return;
      }
      if (this.pw.length < 8) {
        alert('비밀번호는 8자리 이상으로 설정해주세요.');
        return;
      }
      if (this.pw.length > 255) {
        alert('비밀번호가 너무 깁니다.');
        return;
      }
      if (this.pw !== this.pwConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (this.name.length === 0) {
        alert('이름을 적어주세요.');
        return;
      }
      if (this.name.length > 255) {
        alert('이름이 너무 깁니다.');
        return;
      }
      if (this.email.length === 0) {
        alert('이메일을 적어주세요.');
        return;
      }
      if (!(/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.email.toLowerCase())) {
        alert('이메일 형식을 맞춰주세요');
        return;
      }
      if (this.email.length > 255) {
        alert('이메일이 너무 깁니다.');
        return;
      }
      if (!(/^\d{3}-\d{3,4}-\d{4}$/).test(this.phone)) {
        alert('휴대폰 번호를 다시 한번 확인해주세요.');
        return;
      }
      if (this.department.length === 0) {
        alert('학과를 적어주세요.');
        return;
      }
      if (this.studentID.length === 0) {
        alert('학번을 적어주세요');
        return;
      }

      this.$api.request({
        data: `mutation {
          createMember(MemberInput:{
            loginID: "${this.id}"
            password: "${this.pw}"
            email: "${this.email}"
            name: "${this.name}"
            department: "${this.department}"
            studentID: "${this.studentID}"
            phoneNumber: "${this.phone}"
          }) {
            uuid
          }
        }`,
      }).then((res) => {
        const { data } = res;
        if ('errors' in data) {
          if (data.errors[0].message === 'MEM000') {
            alert('아이디가 중복됩니다.');
          } else if (data.errors[0].message === 'MEM001') {
            alert('이메일이 중복됩니다.');
          } else if (data.errors[0].message === 'MEM002') {
            alert('학번이 중복됩니다.');
          } else {
            alert('오류가 발생하였습니다. 회장에게 문의해 주세요');
            console.error(data.errors[0]);
          }
        } else {
          alert('신청 완료됐습니다. 담당자 승인 후 회원 기능 이용 가능합니다');
        }
      }).catch((err) => {
        console.error('회원가입 중 오류가 발생하였습니다');
        console.error(err);
      });
    },
  },
};
</script>

<style scoped>

</style>
