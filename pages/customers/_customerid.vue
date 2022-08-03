<template>
  <div>
    <h1>Customer Info Page {{ $route.params.customerid }}</h1>
    <h2>{{ borrow.data[0] }}</h2>
  </div>
</template>

<script>
export default {
  name: 'CustomerInfoPage',
  async asyncData({ params, $axios }) {
    const [customer_borrows, customer_transactions] = await Promise.all([
      $axios.get(`customer_borrow_items/${params.customerid}`),
      $axios.get(`customer_transactions/${params.customerid}`),
    ])

    return {
      borrow: customer_borrows.data,
      transaction: customer_transactions.data,
    }
  },
}
</script>

<style scoped></style>
