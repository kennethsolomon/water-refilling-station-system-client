<template>
  <v-row>
    <v-col cols="12">
      <div v-if="$fetchState.pending">Loading ...</div>
      <div v-else-if="$fetchState.error">
        Error: {{ $fetchState.error.message }}
      </div>
      <v-card v-else class="ma-3">
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="buildCustomers"
            :search="search"
            disable-sort
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
                <v-btn
                  color="primary"
                  medium
                  @click="showCreateCustomerDialog()"
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
                  <v-icon medium class="mr-1" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon medium @click="deleteItem(item)"> mdi-delete </v-icon>
                </v-col>
              </v-row>
            </template>
            <template #no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <CustomerBorrowListDialog
          v-if="customer_borrow_list_dialog"
          :customer_borrow_list_dialog="customer_borrow_list_dialog"
          :selected_owner_id="selected_owner_id"
          @closeCustomerBorrowListDialog="customer_borrow_list_dialog = false"
        ></CustomerBorrowListDialog>
        <AddCustomerDialog
          v-if="create_customer_dialog"
          :create-customer-dialog="create_customer_dialog"
          :mode="mode"
          @closeCreateCustomerDialog="create_customer_dialog = false"
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
    // Dialogs
    customer_borrow_list_dialog: false,
    create_customer_dialog: false,
    mode: null,

    selected_owner_id: null,
    dialog: false,
    dialogDelete: false,
    search: null,
    customers: [],
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
      { text: 'Classification', value: 'attributes.classification_info.name' },
      { text: 'Contact Number', value: 'attributes.contact_number' },
      { text: 'Last Transaction', value: 'attributes.updated_at' },
      // { text: 'Status', value: 'status', align: 'center' },
      { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
    ],
    editedIndex: -1,
    editedItem: {
      id: '',
      customer_name: '',
      gallon: { borrow: 0, own: 0 },
      classification: '',
      address: '',
      contact_number: '',
      status: '',
      credit: 0,
      last_transaction_date: new Date(Date.now()).toString().substr(4, 11),
    },
    defaultItem: {
      id: '',
      customer_name: '',
      gallon: { borrow: 0, own: 0 },
      classification: '',
      address: '',
      contact_number: '',
      status: '',
      credit: 0,
      last_transaction_date: new Date(Date.now()).toString().substr(4, 11),
    },
  }),
  async fetch() {
    this.customers = await this.$axios.$get(
      'http://localhost:8000/api/customers'
    )
  },
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
    formTitle() {
      return this.editedIndex === -1 ? 'New Customer' : 'Edit Customer'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  methods: {
    showBarrowListDialog(customer_id) {
      this.customer_borrow_list_dialog = true
      this.selected_owner_id = customer_id
    },

    showCreateCustomerDialog() {
      this.create_customer_dialog = true
      this.mode = 'Add'
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>
<style scoped></style>
