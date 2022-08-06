<template>
  <div>
    <template>
      <v-data-table
        :headers="headers"
        :items="transactions.borrows"
        :items-per-page="5"
        class="elevation-1"
      >
        <!-- <template v-slot:[`item.orders`]="{ item }">
          <v-menu
            :close-on-content-click="false"
            open-on-hover
            :nudge-width="200"
            offset-y
            bottom
          >
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <v-icon style="cursor: pointer" color="primary"
                  >mdi-cart</v-icon
                >
              </span>
            </template>
            <v-card flat>
              <v-simple-table dense>
                <template v-slot:default>
                  <h4 class="mx-3">Order List:</h4>
                  <tbody v-for="(order, index) in item.orders" :key="index">
                    <tr>
                      <th>Item:</th>
                      <td>{{ order.item_info.name }}</td>

                      <th>Quantity:</th>
                      <td>{{ order.quantity }}</td>
                      <th>Type of Service:</th>
                      <td>
                        {{
                          order.type_of_service.charAt(0).toUpperCase() +
                          order.type_of_service.slice(1)
                        }}
                      </td>
                      <th>Borrow:</th>
                      <td>{{ Number(order.is_borrow) ? '✅' : '❌' }}</td>
                      <th>Purchase:</th>
                      <td>{{ Number(order.is_purchase) ? '✅' : '❌' }}</td>
                      <th>Free:</th>
                      <td>{{ Number(order.is_free) ? '✅' : '❌' }}</td>
                    </tr>
                    <v-divider></v-divider>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-menu>
        </template> -->

        <!-- <template v-slot:[`item.status`]="{ item }">
          {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
        </template> -->
      </v-data-table>
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
          text: 'Item',
          align: 'start',
          value: 'item_info.name',
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
