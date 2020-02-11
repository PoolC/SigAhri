<template>
  <div>
    {{ post.title }}
    <Viewer :value="post.body"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {
        id: 0,
        title: '',
        body: '',
        board: {
          name: '',
          urlPath: '',
        },
        createdAt: '',
        updatedAt: '',
        comments: [],
        author: {
          name: '',
          loginID: '',
        },
        vote: [],
        isSubscribed: false,
      },
    };
  },
  created() {
    const { id } = this.$route.params;
    if (id <= 0) {
      this.$router.push('/404');
      return;
    }

    this.$api.request({
      data: `query {
        post(postID: ${id}) {
          id,
          title,
          body,
          board { name, urlPath },
          createdAt,
          updatedAt,
          comments {
            author {
              name,
              loginID
            },
            body,
            createdAt,
            id
          },
          author { name, loginID },
          vote {
            id,
            title,
            options { id, text, votersCount, voters { loginID } },
            deadline,
            isMultipleSelectable,
            totalVotersCount
          },
          isSubscribed
        }
      }`,
    }).then((res) => {
      if (!('errors' in res.data)) {
        this.post = res.data.data.post;
      } else {
        this.$router.push('/404');
      }
    });
  },
};
</script>

<style scoped>

</style>
