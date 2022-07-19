<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 primary"
          >Customer Borrow List
          <v-spacer></v-spacer>
          <v-icon @click="$emit('closeCustomerBorrowListDialog')"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-card-text>
          <v-container>
            <template>
              <v-simple-table dark>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left"><h2>Name</h2></th>
                      <th class="text-left"><h2>Quantity</h2></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in customer_borrowed_items"
                      :key="item.item_id"
                    >
                      <td>{{ item.item_info.name }}</td>
                      <td>{{ item.total_borrow }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </template>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['customer_borrow_list_dialog', 'selected_owner_id'],
  data() {
    return {
      dialog: false,
      customer_borrowed_items: [],
    }
  },

  async fetch() {
    this.customer_borrowed_items = await this.$axios.$get(
      `http://localhost:8000/api/customer_total_borrow_items/${this.selected_owner_id}`
    )
  },

  created() {
    this.dialog = this.customer_borrow_list_dialog
  },
}
</script>

<style scoped></style>
