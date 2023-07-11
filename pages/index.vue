<template>
  <div>
    <lingzi-loading v-if="loading" />
    <div
      v-else-if="languages.length < 1"
      class="d-flex flex-column align-center"
    >
      <lingzi-ilustration>
        floating
      </lingzi-ilustration>
      <div class="text-h5 text-center">
        No languages
      </div>
      <v-btn
        class="mt-3"
        @click="addLanguageDialog = true"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </div>
    <v-row
      v-else
      dense
      justify="center"
      align="center"
      class="mx-3"
      style="width: 90vw;"
    >
      <v-col
        v-for="language in languages"
        :key="language.id"
        :title="language.name"
        cols="12"
        sm="6"
        lg="3"
        xl="2"
      >
        <v-card @click="useRouter().push({ path: '/categories', query: { language: language.id }})">
          <v-img
            :src="`/ilustrations/languages/${language.language}.svg`"
            height="165px"
            cover
            class="rounded-lg"
          >
            <v-expand-transition>
              <v-sheet
                class="d-flex justify-center align-center language-card ma-2"
                rounded="lg"
              >
                <div
                  class="text-h5 text-truncate"
                  style="max-width: 165px;"
                />
              </v-sheet>
            </v-expand-transition>
          </v-img>
        </v-card>
      </v-col>
      <v-btn
        class="mb-3"
        location="bottom"
        position="fixed"
        @click="addLanguageDialog = true"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-row>
    <lingzi-dialog
      v-model="addLanguageDialog"
      title="Add language"
      padding="pa-3"
    >
      <div
        v-if="createLoading"
        class="d-flex justify-center"
      >
        <lingzi-loading />
      </div>
      <div v-if="!createLoading">
        <v-text-field
          v-model="customLanguageName"
          density="compact"
          label="Custom Name"
          variant="outlined"
          color="primary"
        />
        <v-select
          v-model="selectedLanguage"
          :items="supportedLanguages"
          item-title="name"
          density="compact"
          variant="outlined"
          item-value="id"
          hide-details="auto"
          color="primary"
        />
      </div>
      <template
        v-if="!createLoading"
        #actions
      >
        <v-btn
          class="ma-1 text-none"
          color="red"
          flat
          @click="addLanguageDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          class="ma-1 text-none"
          flat
          @click="createLanguage"
        >
          Save
        </v-btn>
      </template>
    </lingzi-dialog>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try {
    await useLingzi().languages.get()
  } catch (e) {
    console.log(e)
    // TODO catch error
  }
  loading.value = false
})
const languages = computed(() => {
  return useLanguagesStore().items
})
const addLanguageDialog = ref(false)

const supportedLanguages = [
  {
    id: 'russian',
    name: 'Russian'
  },
  {
    id: 'english',
    name: 'English'
  },
  {
    id: 'spanish',
    name: 'Spanish'
  },
  {
    id: 'german',
    name: 'German'
  }
]
const selectedLanguage = ref('russian')
const customLanguageName = ref('')
const createLoading = ref(false)
const createLanguage = async () => {
  createLoading.value = true
  try {
    await useLingzi().languages.create({
      name: customLanguageName.value,
      language: selectedLanguage.value
    })
  } catch (e) {
    // TODO catch error
    console.log(e)
  }
  addLanguageDialog.value = false
  createLoading.value = false
  selectedLanguage.value = 'russian'
  customLanguageName.value = ''
}
</script>

<style>
.language-card {
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(33, 33, 33,.95) 0%, rgba(33,33,33, .95) 38%, rgba(33, 33, 33, 1) 62%, rgba(33, 33, 33, 1) 100%);
}
</style>
