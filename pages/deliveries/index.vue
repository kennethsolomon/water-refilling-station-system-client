<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="transactions"
      :footer-props="{
        'items-per-page-options': [5, 10, 15, 30, 50],
        'show-first-last-page': true,
      }"
      :options.sync="options"
      :server-items-length="totalTransactions"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search"
          ref="search"
          class="mx-4"
          prepend-inner-icon="mdi-magnify"
          @keyup.enter="searchFunction()"
        >
          <template v-slot:append v-if="search">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon @click="clearSearch" v-bind="attrs" v-on="on"
                  >mdi-close</v-icon
                >
              </template>
              <span>Clear seach</span>
            </v-tooltip>
          </template>
          <template v-slot:append-outer v-if="search">
            <v-btn
              v-if="!!search"
              depressed
              small
              class="mr-2"
              @click="searchFunction()"
              >SEARCH</v-btn
            >
          </template>
        </v-text-field>
      </template>
      <template v-slot:[`footer.page-text`]="items">
        {{ items.pageStart.toLocaleString() }} -
        {{ items.pageStop.toLocaleString() }} of
        {{ items.itemsLength.toLocaleString() }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'DeliveryPage',
  data() {
    return {
      search: '',
      totalTransactions: 0,
      transactions: [],
      loading: true,
      options: {},
      headers: [{ text: 'ID', value: 'id' }],
      meta: {},
    }
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi()
      },
      deep: true,
    },
  },
  methods: {
    getDataFromApi() {
      this.loading = true
      this.$axios
        .$get(
          `transactions?status=active&page=${this.options.page}
            &rows=${this.options.itemsPerPage}` +
            `${this.search ? '&search=' + this.search : ''}`
        )
        .then((response) => {
          this.transactions = response.data
          this.totalTransactions = response.meta.total
          this.meta = response.meta

          this.loading = false
        })
    },
    pageColor() {
      return 'black'
      // return JSON.parse(localStorage.getItem('dark_theme'))
      // ? 'white' : 'black'
    },
    searchFunction() {
      this.options.page === 1 ? this.getDataFromApi() : (this.options.page = 1)
    },
    clearSearch() {
      this.search = ''
    },
  },
}
</script>

<style scoped></style>
