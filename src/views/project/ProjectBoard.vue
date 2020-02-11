<template>
  <div>
    <div v-for="project of projects" :key="project.ID">
      <router-link :to="`/project/${project.id}`">
        {{ project.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [],
    };
  },
  created() {
    this.$api.request({
      data: `query {
        projects {
          body, description, duration, genre
          id, name, participants, thumbnailURL
        }
      }`,
    }).then((res) => {
      this.projects = res.data.data.projects;
    });
  },
};
</script>

<style scoped>

</style>
