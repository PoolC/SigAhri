<template>
  <div>
    {{ boards[0].name }}
  </div>
</template>

<script>
export default {
  name: 'Board',
  data() {
    return {
      boards: [],
      board: {
        id: 1,
        isSubscribed: false,
        name: '공지사항',
        urlPath: 'notice',
        readPermission: 'PUBLIC',
        writePermission: 'MEMBER',
        posts: [],
      },
      curBoard: 1,
    };
  },
  created() {
    this.$api.request({
      data: `query {
        boards {
          id, isSubscribed, name, urlPath,
          readPermission, writePermission,
        }
      }`,
    }).then((res) => {
      if (!('errors' in res.data)) {
        this.boards = res.data.data.boards;
      }
    });

    this.$api.request({
      data: `query {
        postPage({
          boardID: 1,
          count: 15
        }) {
          pageInfo { hasNext, hasPrevious },
          posts {
            author, title, createdAt
          }
        }
      }`,
    }).then((res) => {
      this.board.posts = res.data.data.postPage.posts;
    });
  },
};
</script>
