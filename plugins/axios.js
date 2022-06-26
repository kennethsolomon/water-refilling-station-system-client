// Interceptor to check if cookie has expired
export default function ({ $axios, $auth, redirect }) {
  $axios.onError((error) => {
    if (error.response.status === 401) {
      $auth.logout()

      redirect('/login')
    }
  })
}
