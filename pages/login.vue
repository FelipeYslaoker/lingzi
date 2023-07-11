<script setup lang="ts">
const user = reactive({
  email: '',
  password: ''
})
const loading = ref(false)
const login = async () => {
  loading.value = true
  try {
    await useAuth().loginWith('local', {
      body: {
        email: user.email,
        password: user.password
      }
    })
    useRouter().push('/')
  } catch (e) {
    console.log(e)
  }
  loading.value = false
}
</script>
<template>
  <div>
    <lingzi-card
      width="400px"
      title="Login"
    >
      <v-text-field
        v-model="user.email"
        dense
        variant="outlined"
        label="Email"
        density="compact"
        hide-details="auto"
        class="mb-3"
        type="email"
        :disabled="loading"
      />
      <v-text-field
        v-model="user.password"
        dense
        variant="outlined"
        label="Password"
        density="compact"
        hide-details="auto"
        type="password"
        :disabled="loading"
      />
      <template #actions>
        <v-btn
          class="text-none"
          color="primary"
          flat
          :loading="loading"
          @click="login"
        >
          Login
        </v-btn>
      </template>
    </lingzi-card>
  </div>
</template>
