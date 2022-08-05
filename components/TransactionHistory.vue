<template>
  <div>
    <template>
      <v-data-table
        :headers="headers"
        :items="transactions"
        :items-per-page="5"
        class="elevation-1"
      ></v-data-table>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    transactions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      headers: [
        {
          text: 'Transaction ID',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Orders', value: 'orders' },
        { text: 'Credit', value: 'credit' },
        { text: 'Discount', value: 'discount' },
        { text: 'Employee', value: 'employee_info.fullname' },
        { text: 'Status', value: 'status' },
        { text: 'Last Transaction', value: 'latest_transaction' },
      ],
    }
  },
}
</script>

<style scoped></style>
