<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="buildCustomers"
      :search="search"
      sort-by="attributes.transactions[0].attributes.latest_transaction"
      :sort-desc="true"
      data-table-scroll-bar-width="17px"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Customers</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            class="mr-3"
            single-line
            hide-details
          ></v-text-field>
          <v-btn color="primary" medium @click="showCustomerCreateDialog()"
            ><v-icon class="mr-2">mdi-plus</v-icon> Add Customer</v-btn
          >
        </v-toolbar>
      </template>
      <template #[`item.gallon`]="{ item }">
        <v-row>
          <v-col cols="12">
            <v-icon
              medium
              :disabled="!item.attributes.borrows.length"
              @click="showBarrowListDialog(item.id)"
            >
              mdi-water-alert-outline
            </v-icon>
          </v-col>
        </v-row>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-row>
          <v-col cols="12">
            <v-icon medium class="mr-1"> mdi-water-plus </v-icon>
            <v-icon
              medium
              class="mr-1"
              @click="$router.push(`/customers/${item.id}`)"
            >
              mdi-eye
            </v-icon>
            <v-icon medium class="mr-1" @click="customerUpdate(item)">
              mdi-pencil
            </v-icon>
            <v-icon medium @click="customerDelete(item)"> mdi-delete </v-icon>
          </v-col>
        </v-row>
      </template>
      <template #no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <DeleteConfirmationDialog
      v-if="delete_dialog_data.delete_confirmation_dialog"
      :delete-dialog-data="delete_dialog_data"
      @confirmDelete="confirmDelete($event)"
    ></DeleteConfirmationDialog>
  </div>
</template>

<script>
export default {
  props: {
    customers: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    search: null,
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Customer Name', value: 'attributes.fullname' },
      { text: 'Address', value: 'attributes.address' },
      {
        text: 'Credit',
        value: 'attributes.credit',
        align: 'center',
      },
      { text: 'Borrow', value: 'gallon', align: 'center' },
      {
        text: 'Classification',
        value: 'attributes.classification_info.name',
      },
      { text: 'Contact Number', value: 'attributes.contact_number' },
      {
        text: 'Last Transaction',
        value: 'attributes.transactions[0].attributes.latest_transaction',
      },
      { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
    ],
    // DELETE DIALOG
    delete_dialog_data: {
      delete_confirmation_dialog: false,
      delete_item_id: null,
      delete_title: null,
    },
  }),
  computed: {
    buildCustomers() {
      return this.customers.data.reduce((list, row) => {
        let total_credit = 0

        // Compute Total Credits
        row.attributes.transactions.forEach((element) => {
          total_credit += Number(element?.attributes?.credit)
        })
        row.attributes.credit = total_credit

        list.push(row)
        return list
      }, [])
    },
  },
  methods: {
    showBarrowListDialog(customer_id) {
      this.$emit('show-customer-borrow-list-dialog')
      this.$emit('set-customer-id', customer_id)
    },
    showCustomerCreateDialog() {
      this.$emit('customer-create-dialog')
      this.$emit('set-mode', 'Add')
    },
    customerUpdate(item) {
      this.$emit('customer-update-dialog')
      this.$emit('set-mode', 'Edit')
      this.$emit('selected-customer', item)
    },

    // DELETE DIALOG
    customerDelete(item) {
      this.delete_dialog_data.delete_item_id = item.id
      this.delete_dialog_data.delete_title = item.attributes.fullname
      this.delete_dialog_data.delete_confirmation_dialog = true
    },
    confirmDelete(confirm) {
      if (confirm) {
        this.resetDeleteDialog()
      } else {
        this.resetDeleteDialog()
      }
    },
    resetDeleteDialog() {
      this.delete_dialog_data.delete_item_id = null
      this.delete_dialog_data.delete_confirmation_dialog = false
      this.delete_dialog_data.delete_title = null
    },
    // END DELETE DIALOG
  },
}
</script>

<style scoped></style>
