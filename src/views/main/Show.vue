<template>
  <div class="mt-4 ml-5"><router-link :to="{name: 'main.index'}">Back</router-link></div>
  <div class="container">
    <div class="comments" v-if="comment">
      <h3 class="title-comments">Коментарі ({{this.count}})</h3>
      <ul class="media-list">
        <!-- Комментарий (уровень 1) -->
        <li class="media">
          <div class="media-body ml-3">
            <div class="col-8 media-heading p-1" style="background-color: #ECECEC">
              <img class="media-object img-rounded rounded-circle "
                   src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(23).webp"
                   style="width: 40px; height: 40px" alt="...">

              <div class="author ml-2">{{ comment.user.name }}</div>
              <div class="metadata">
                <span class="date">{{ comment.creation_time }}</span>
              </div>
            </div>
            <div class="col-8 media-text text-justify mb-3 mt-2">{{ comment.comment }}</div>
            <!-- Вложенный медиа-компонент (уровень 2) -->
            <div v-if="replies">
              <div class="media ml-2" v-for="reply in replies">
                <div class="media-body ml-2">
                  <div class="col-8 media-heading p-1" style="background-color: #ECECEC">
                    <img class="media-object img-rounded rounded-circle "
                         src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(23).webp"
                         style="width: 40px; height: 40px" alt="...">
                    <div class="author ml-2">{{ reply.user.name }}</div>
                    <div class="metadata">
                      <span class="date">{{ reply.creation_time }}</span>
                    </div>
                  </div>
                  <div class="col-8 media-text text-justify mb-3 mt-2" v-html="reply.comment">
                  </div>
                </div>
              </div>
            </div>

          </div>
        </li>
      </ul>
    </div>
    <div>
      <button v-show="toggle" @click.prevent="toggle = !toggle">Reply</button>
      <div v-show="!toggle">
      <div>
        <div class="text-danger" v-if="v$.user.$error">{{ v$.user.$silentErrors[0].$message }}</div>
        <input class="form-control w-25" type="text" placeholder="Your name" v-model="user" @blur="v$.user.$touch" @click.prevent="v$.user.$touch"><br>
      </div>
      <div>
        <div class="text-danger" v-if="v$.email.$error">{{ v$.email.$silentErrors[0].$message }}</div>
        <div class="text-danger" v-if="this.errors === this.isEmailTaken">{{ this.errors.message }}</div>
        <input class="form-control  w-25" type="text" placeholder="Your email" v-model="email" @blur="v$.email.$touch" @click.prevent="v$.email.$touch"><br>
      </div>
      <div>
        <div class="text-danger" v-if="v$.home_page.$error">{{ v$.home_page.$silentErrors[0].$message }}</div>
        <input class="form-control w-25" type="text" placeholder="Your homepage" v-model="home_page" @blur="v$.home_page.$touch" @click.prevent="v$.home_page.$touch"><br>
      </div>
      <div class="text-danger" v-if="v$.newReply.$error">{{ v$.newReply.$silentErrors[0].$message }}</div>
      <textarea class="form-control mb-2 w-50" v-model="newReply" @blur="v$.newReply.$touch" @click.prevent="v$.newReply.$touch" placeholder="Your reply"></textarea>
      <div class="mb-4">
        <button class="mr-4 bg-info" @click.prevent="addNewReply(comment.id)">Reply</button>
        <button class="mr-4 bg-danger" @click.prevent="toggle = !toggle">Cancel</button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import {email, required, helpers} from "@vuelidate/validators";


const domain = helpers.regex(/^(?!:\/\/)(?=.{1,255}$)((.{1,63}\.){1,127}(?![0-9]*$)[a-z0-9-]+\.?)$/i)


export default {
  name: "Show",

  setup () {
    return { v$: useVuelidate() }
  },

  mounted() {
    this.getMainComment()
  },

  data() {
    return {
      count: null,
      toggle: true,
      comment: null,
      replies: null,
      user: null,
      email: null,
      home_page: null,
      newReply: null,
      errors: null,
      status: null,
      parent_id: this.$route.params.id,
      isEmailTaken : "The email has already been taken"
    }
  },
  validations () {
    return {
      user: {required},
      email: {required, email},
      home_page: {domain: helpers.withMessage('The website field format is invalid.', domain)},
      newReply: {required}
    }
  },

  methods: {

    getMainComment(id) {
      this.axios.get(`http://localhost:8876/api/comments/${this.$route.params.id}`)
          .then(res => {
            this.comment = res.data[0]
            this.replies = res.data[0].replies
            this.count = this.replies.length + 1
            // console.log(this.replies);
          })
    },

    addNewReply(id) {
      this.axios.post(`http://localhost:8876/api/reply/${id}`, {
        'user': this.user,
        'email': this.email,
        'home_page': this.home_page,
        'comment': this.newReply,
        'parent_id': this.parent_id
      })
          .then(res => {
            console.log(res);
            this.getMainComment(this.$route.params.id)
            this.user = ""
            this.email = ""
            this.home_page = ""
            this.newReply = ""
            this.v$.$reset()
            this.toggle = true
          }).catch(err => {
        this.v$.$touch()
        console.log(err);
        this.errors = err.response.data.errors.email[0]
      })
    },

  }
}
</script>

<style scoped>

</style>