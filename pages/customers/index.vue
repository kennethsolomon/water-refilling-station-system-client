<template>
  <v-row>
    <v-col cols="12">
      <CustomerDataTable
        @customer-create-dialog="customer_create_update_dialog = true"
        @customer-update-dialog="customer_create_update_dialog = true"
        @set-mode="setMode($event)"
        @show-customer-borrow-list-dialog="customer_borrow_list_dialog = true"
        @set-customer-id="setCustomerId($event)"
        @selected-customer="customerEdit($event)"
      ></CustomerDataTable>
      <CustomerBorrowListDialog
        v-if="customer_borrow_list_dialog"
        :show-customer-borrow-list-dialog="customer_borrow_list_dialog"
        :customer-id="customer_id"
        @close-customer-borrow-list-dialog="customer_borrow_list_dialog = false"
      ></CustomerBorrowListDialog>
      <LazyCustomerAddEditDialog
        v-if="customer_create_update_dialog"
        :customer-create-update-dialog="customer_create_update_dialog"
        :selected-customer="selected_customer"
        :mode="mode"
        @close-create-customer-dialog="customer_create_update_dialog = false"
      >
      </LazyCustomerAddEditDialog>
    </v-col>

    <SnackBar></SnackBar>
  </v-row>
</template>

<script>
export default {
  name: 'CustomersPage',
  data: () => ({
    customer_borrow_list_dialog: false,
    customer_create_update_dialog: false,
    mode: null,
    customer_id: null,
    selected_customer: {},
  }),

  methods: {
    setCustomerId(customer_id) {
      this.customer_id = Number(customer_id)
    },
    setMode(mode) {
      this.mode = mode
    },
    customerEdit(selected_customer) {
      this.selected_customer = selected_customer
    },
  },
}
</script>
<style scoped></style>
