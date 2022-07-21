<template>
  <v-row>
    <v-col cols="12">
      <v-card class="ma-3">
        <div v-if="$fetchState.pending">Loading ...</div>
        <div v-else-if="$fetchState.error">
          Error: {{ $fetchState.error.message }}
        </div>
        <v-card-text v-else>
          <CustomerDataTable
            :customers="customers"
            @create-customer-dialog="create_customer_dialog = true"
            @set-mode="mode = 'Add'"
            @show-customer-borrow-list-dialog="
              customer_borrow_list_dialog = true
            "
            @set-customer-id="setCustomerId($event)"
          ></CustomerDataTable>
        </v-card-text>
        <CustomerBorrowListDialog
          v-if="customer_borrow_list_dialog"
          :customer_borrow_list_dialog="customer_borrow_list_dialog"
          :selected_owner_id="selected_owner_id"
          @close-customer-borrow-list-dialog="customer_borrow_list_dialog = false"
        ></CustomerBorrowListDialog>
        <AddCustomerDialog
          v-if="create_customer_dialog"
          :create-customer-dialog="create_customer_dialog"
          :mode="mode"
          @close-create-customer-dialog="create_customer_dialog = false"
          @fetch-new-customer-data="fetchNewCustomerData"
        >
        </AddCustomerDialog>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CustomersPage',
  data: () => ({
    customer_borrow_list_dialog: false,
    create_customer_dialog: false,
    mode: null,
    selected_owner_id: null,
    customers: [],
  }),
  async fetch() {
    this.customers = await this.$axios.$get(
      'http://localhost:8000/api/customers'
    )
  },

  methods: {
    setCustomerId(customer_id) {
      this.selected_owner_id = customer_id
    },
    fetchNewCustomerData() {
      this.$fetch()
    },
  },
}
</script>
<style scoped></style>
