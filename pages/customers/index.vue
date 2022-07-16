<template>
  <div>
    <v-card class="py-4">
      <!-- <v-card-title class="headline">Customer</v-card-title> -->
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filterItems"
          :search="search"
          disable-sort
          data-table-scroll-bar-width="17px"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Customers</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-row>
                <v-col cols="10">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-select
                    class="pr-5"
                    :items="filter_items"
                    v-model="filtered_status"
                    hide-details
                    clearable
                    single-line
                    label="Filter Status"
                  ></v-select>
                </v-col>
              </v-row>
              <v-dialog v-model="dialog">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark v-bind="attrs" v-on="on">
                    New Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Dessert name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.calories"
                            label="Calories"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.fat"
                            label="Fat (g)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.carbs"
                            label="Carbs (g)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.protein"
                            label="Protein (g)"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.return_gallon`]="{ item }">
            <v-row>
              <v-col cols="12">
                {{ item.credit }}
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.gallon`]="{ item }">
            <v-row>
              <v-col cols="12">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" medium> mdi-eye </v-icon>
                  </template>
                  <span>
                    <v-card max-width="344">
                      <v-list-item three-line>
                        <v-list-item-content>
                          <span class="text-h6"
                            >Gallon Borrow: {{ item.gallon.borrow }}</span
                          >
                          <span class="text-h6"
                            >Gallon Own: {{ item.gallon.own }}</span
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </span>
                </v-tooltip>
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-row>
              <v-col cols="12">
                <v-chip
                  class="ma-2"
                  :color="setColor(item.status)"
                  text-color="white"
                >
                  {{ item.status }}
                </v-chip>
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
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
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'CustomersPage',
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: null,
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Customer Name', value: 'customer_name' },
      { text: 'Address', value: 'address' },
      { text: 'Credit', value: 'credit', align: 'center' },
      { text: 'Gallon', value: 'gallon', align: 'center' },
      { text: 'Classification', value: 'classification' },
      { text: 'Contact Number', value: 'contact_number' },
      { text: 'Last Transaction', value: 'last_transaction_date' },
      { text: 'Status', value: 'status', align: 'center' },
      { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
    ],
    filter_items: ['Active', 'Done', 'Credit'],
    filtered_status: 'Active',
    desserts: [],
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

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Customer' : 'Edit Customer'
    },
    filterItems() {
      if (this.filtered_status?.length) {
        return this.desserts.filter((item) => {
          if (this.filtered_status === 'Credit') {
            return item.credit > 0
          }
          return item.status === this.filtered_status
        })
      }
      return this.desserts
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

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.desserts = [
        {
          id: 100,
          customer_name: 'Kenneth Solomon',
          classification: 'Reseller',
          gallon: { borrow: 3, own: 1 },
          address: 'Ph3 Blk12 Lot19 Seabreze Cabid-an Sorsogon City',
          contact_number: '09301787782',
          status: 'Done',
          credit: 100,
          last_transaction_date: new Date(Date.now()).toString().substr(4, 11),
        },
        {
          id: 101,
          customer_name: 'Camille Dioneda',
          classification: 'Reseller',
          gallon: { borrow: 0, own: 3 },
          address: 'Pangpang Sorsogon City',
          contact_number: '09238232782',
          status: 'Done',
          credit: 0,
          last_transaction_date: new Date(Date.now()).toString().substr(4, 11),
        },
        {
          id: 102,
          customer_name: 'Milagros Lim',
          classification: 'Dealer',
          gallon: { borrow: 0, own: 7 },
          address: 'Bulan Sorsogon City',
          contact_number: '09122530278',
          status: 'Active',
          credit: 5,
          last_transaction_date: new Date(Date.now()).toString().substr(4, 11),
        },
        {
          id: 103,
          customer_name: 'Ricardo Calolot',
          classification: 'Dealer',
          gallon: { borrow: 5, own: 0 },
          address: 'Bulan Sorsogon City',
          contact_number: '09122325235',
          status: 'Active',
          credit: 0,
          last_transaction_date: new Date(Date.now()).toString().substr(4, 11),
        },
      ]
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

    setColor(status) {
      return status === 'Active' ? 'green' : 'red'
    },
  },
}
</script>
<style scoped></style>
