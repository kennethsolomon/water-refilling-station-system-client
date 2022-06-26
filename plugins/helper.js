export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  inject('hello', (msg) => console.log(`Hello ${msg}!`))

  // Sample Global Helper
  inject('add', (num1, num2) => {
    console.log(num1 + num2)
  })
}
