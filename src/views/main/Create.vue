<template>
  <div class="mt-4 mx-4"><router-link :to="{name: 'main.index'}">Back</router-link></div>
  <div class="container">
    <div class="mb-4"><h2>Comment creation</h2></div>
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
      <div class="text-danger" v-if="v$.newComment.$error">{{ v$.newComment.$silentErrors[0].$message }}</div>
      <textarea class="form-control mb-2 w-50" v-model="newComment" @blur="v$.newComment.$touch" @click.prevent="v$.newComment.$touch" placeholder="Your comment"></textarea>
      <div class="mb-4">
        <button class="mr-4 bg-info" @click.prevent="addNewComment()">Comment</button>
      </div>
  </div>

</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import {email, required, helpers} from "@vuelidate/validators";
import router from "../../router.js";


const domain = helpers.regex(/^(?!:\/\/)(?=.{1,255}$)((.{1,63}\.){1,127}(?![0-9]*$)[a-z0-9-]+\.?)$/i)


export default {
  name: "Create",

  setup () {
    return { v$: useVuelidate() }
  },


  data() {
    return {
      comment: null,
      replies: null,
      user: null,
      email: null,
      home_page: null,
      newComment: null,
      errors: null,
      status: null,
      isEmailTaken : "The email has already been taken"
    }
  },
  validations () {
    return {
      user: {required},
      email: {required, email},
      home_page: {domain: helpers.withMessage('The website field format is invalid.', domain)},
      newComment: {required}
    }
  },

  methods: {

    addNewComment() {
      this.axios.post('http://localhost:8876/api/comments/create', {
        'user': this.user,
        'email': this.email,
        'home_page': this.home_page,
        'comment': this.newComment,
      })
          .then(res => {
            router.push({name: 'main.index'})
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