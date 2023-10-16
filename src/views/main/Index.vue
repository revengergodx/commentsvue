<template>
  <div class="container">
    <div class="m-4">
      <router-link :to="{name: 'main.create'}">
        <button class="btn btn-primary">New Comment</button>
      </router-link>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th scope="col">Comment</th>
        <th scope="col"><a href="#" @click.prevent="changeSort('name')">User Name</a>
          <span v-if="sort_direction==='desc' && sort_field==='name'">&uarr;</span>
          <span v-if="sort_direction==='asc' && sort_field==='name'">&darr;</span>
        </th>
        <th scope="col"><a href="#" @click.prevent="changeSort('email')">Email</a>
          <span v-if="sort_direction==='desc' && sort_field==='email'">&uarr;</span>
          <span v-if="sort_direction==='asc' && sort_field==='email'">&darr;</span>
        </th>
        <th scope="col"><a href="#" @click.prevent="changeSort('creation_time')">Date</a>
          <span v-if="sort_direction==='desc' && sort_field==='creation_time'">&uarr;</span>
          <span v-if="sort_direction==='asc' && sort_field==='creation_time'">&darr;</span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="comment in comments">
        <td class="w-50">
          <router-link :to="{name: 'main.show', params: {id: comment.id}}">{{ comment.comment }}</router-link>
        </td>
        <td>{{ comment.user.name }}</td>
        <td>{{ comment.user.email }}</td>
        <td>{{ comment.creation_time }}</td>
      </tr>

      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Index",

  mounted() {
    this.getMainComments()
  },

  data() {
    return {
      comments: {},
      sort_direction: 'desc',
      sort_field: 'creation_time'
    }
  },

  methods: {
    getMainComments(page = 1) {
      this.axios.get("http://localhost:8876/api/comments?page" +
          page +
          "&sort_field=" +
          this.sort_field +
          "&sort_direction=" +
          this.sort_direction
      ).then(res => {
        console.log(res);
        this.comments = res.data.data
      }).catch(err => {
        console.log(err);
      })
    },

    changeSort(field) {
      if (this.sort_field === field) {
        this.sort_direction = this.sort_direction === 'asc' ? 'desc' : 'asc';
      } else {
        this.sort_field = field
      }
      this.getMainComments()
    }

  }
}
</script>

<style scoped>

</style>