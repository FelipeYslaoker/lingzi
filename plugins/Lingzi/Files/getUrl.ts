export const getUrl = (fileid: string) => {
  return $http.getDefaults().baseURL + `/files/${fileid}`
}
