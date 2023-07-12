<template>
  <div>
    <v-fade-transition>
      <div v-if="show">
        <div style="position: absolute; top: 0px; left: 0px; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, .75); z-index: 1000;" class="d-flex justify-center align-center flex-column">
          <lingzi-loading />
          <div class="mt-3 text-h5">
            {{ dialogData.title }}
          </div>
          <v-btn v-if="cancelable" class="mt-3 text-none" @click="cancel">
            Cancel
          </v-btn>
        </div>
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup lang="ts">
const show = ref(false)

const showLoadingDialogState = computed(() => {
  return useGlobalDialogStore().loadingDialog.show
})
const cancelable = computed(() => {
  return useGlobalDialogStore().loadingDialog.cancelable
})
const dialogData = computed(() => {
  return useGlobalDialogStore().loadingDialog
})

watch(show, (value) => {
  if (!value) {
    useGlobalDialogStore().setLoadingDialog({
      title: '',
      cancelable: false,
      show: false
    })
  }
})
watch(showLoadingDialogState, () => {
  show.value = showLoadingDialogState.value || false
})

const cancel = () => {
  show.value = false
  useRouter().push('/')
}
</script>
