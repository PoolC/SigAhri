<template>
  <div>
    <input-box label="제목" @change="post.title = $event" :value="post.title"/>
    <p>본문</p>
    <editor v-model="post.body"/>
    <my-button @click="submitPost">
      작성
    </my-button>
  </div>
</template>

<script>
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import InputBox from '@/components/InputBox.vue';
import MyButton from '@/components/MyButton.vue';

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

export default {
  components: {
    MyButton,
    InputBox,
  },
  data() {
    return {
      boards: [],
      post: {
        id: 0,
        title: '',
        body: '',
        vote: [],
      },
      uploadedFiles: [],
      editorPreviewStyle: 'vertical',
      editorOptions: {
        language: 'ko_KR',
        minHeight: '1000px',
        usageStatistics: false,
      },
    };
  },
  created() {
    if (!this.$store.state.isLogin) {
      this.$router.push('/404');
    }

    const { id } = this.$route.params;
    if (id) {
      this.$api.request({
        data: `query {
        post(postID: ${id}) {
          id, title, body, vote
        }
      }`,
      }).then((res) => {
        this.post = res.data.data.post;
      });
    }

    this.$api.request({
      data: `query {
        boards {
          id, name, readPermission, writePermission
        }
      }`,
    }).then((res) => {
      const { boards } = res.data.data;
      this.boards = boards.filter((board) => this.$store.state.isAdmin || board.writePermission === 'MEMBER');
    });

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  methods: {
    handleResize() {
      if (window.innerWidth < 768) {
        this.editorPreviewStyle = 'tab';
      } else {
        this.editorPreviewStyle = 'vertical';
      }
    },
    changeFile(event) {
      const node = event.target;
      if (!node || !node.files || node.files.length <= 0) return;
      [this.file] = node.files;
      this.uploadName = this.uploadName || this.file.name;
    },
    uploadFile() {
      if (!this.file) return;
      this.uploadName = this.uploadName || this.file.name;
      if (this.uploadName === '') {
        alert('파일 이름이 없습니다(bug)');
        return;
      }
      const data = new FormData();
      data.append('file', this.file);
      if (this.file.size > (32 * 1024 * 1024)) {
        alert('파일은 32MB 까지 업로드 가능합니다');
        return;
      }

      this.$api({
        baseURL: 'https://api.poolc.org',
        url: '/files',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then((res) => {
        this.uploadedFiles.push(res.data.data);
      });
    },
    copyToClipboard(event) {
      const imgExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const fileName = `https://api.poolc.org/files/${event.target.innerText}`;
      const isImg = imgExtensions.some((ss) => fileName.toLowerCase().includes(ss));
      let text = '';
      if (isImg) text = `![](${fileName})`;
      else text = `[](${fileName})`;
      this.$copyText(text);
    },
    submitPost() {
      if (this.title.length) {
        alert('제목을 입력해 주세요');
        return;
      }

      const type = this.post.id ? 'update' : 'create';
      this.$api.request({
        data: `mutation {
          ${type}Post(
            boardID: ${this.boardID},
            PostInput: {
              title: "${this.post.title}",
              body: """${this.post.body}"""
            }
            ${type === 'create'
              && this.post.vote.length > 0
              && `, VoteInput: {
                title: "",
                deadline: "",
                isMultipleSelectable: ,
                optionTexts: []
              }`}
          ) {
            id
          }
        }`,
      }).then((res) => {
        if ('errors' in res.data) {
          const error = res.data.errors[0];
          if (error.message === 'ERR401' || error.message === 'ERR403') {
            alert('권한이 없습니다');
          } else if (error.message === 'ERR500') {
            alert('알 수 없는 에러가 발생하였습니다. 회장/플친으로 문의바랍니다');
          }
          return;
        }

        let id;
        if (type === 'create') id = res.data.data.createPost.id;
        else if (type === 'update') id = res.data.data.updatePost.id;

        this.$router.push(`/posts/${id}`);
      });
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style scoped>

</style>
