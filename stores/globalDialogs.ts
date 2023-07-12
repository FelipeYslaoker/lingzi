interface GlobalDialog {
  title: string
  content: string
  color: string
  icon: string
  show: boolean
}
interface LoadingDialog {
  title: string
  show?: boolean
  cancelable: boolean
}

export const useGlobalDialogStore = defineStore('globalDialogs', {
  state: () => ({
    global: {
      title: '',
      content: '',
      color: '',
      icon: '',
      show: false
    } as GlobalDialog,
    loadingDialog: {
      title: '',
      show: false,
      cancelable: false
    } as LoadingDialog
  }),
  actions: {
    setGlobalDialog (params: GlobalDialog) {
      this.global = useNewJsonFrom(params)
    },
    setLoadingDialog (params: LoadingDialog) {
        this.loadingDialog = useNewJsonFrom(params)
    },
    pushError (title: string, e: any) {
      this.setGlobalDialog({
        title,
        content: e?.response?.data?.message || e || 'Erro desconhecido',
        icon: 'mdi-alert',
        color: 'red',
        show: true
      })
    },
    pushWarn (title: string, e: any) {
      this.setGlobalDialog({
        title,
        content: e?.response?.data?.message || e || 'Erro interno do servidor, tente novamente mais tarde.',
        icon: 'warning',
        color: 'orange',
        show: true
      })
    },
    loading (params?: LoadingDialog) {
      const currentShowState = this.loadingDialog.show
      if (!params) {
        params = {
          title: '',
          cancelable: false
        }
      }
      if (typeof params?.show === 'undefined') {
        params.show = !currentShowState
      }
      this.setLoadingDialog(params)
    }
  }
})
