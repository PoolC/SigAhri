<template>
  <div>
    {{ project.name }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      project: {},
    };
  },
  created() {
    this.$api.request({
      data: `query {
        project(projectID: ${this.$route.params.id}) {
          body, description, duration, genre,
          id, name, participants, thumbnailURL
        }
      }`,
    }).then((res) => {
      if ('errors' in res.data) {
        this.$router.push('/404');
        return;
      }
      this.project = res.data.data.project;
    });
  },
};
</script>

<style scoped>

</style>
