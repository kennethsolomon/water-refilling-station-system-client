<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="py-4">
        <v-card-title class="headline"> Public Home Page </v-card-title>
        <v-card-text> Welcome Home </v-card-text>
<v-img
  :lazy-src="current_card_img"
  :src="current_card_img"
></v-img>
        <v-btn @click="drawACard()">Draw a Card</v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  // Use if Global middleware is on inside nuxt.config and you want to exclude this page
  // auth: false

  data: () => ({
    current_card_img: null
  }),

  async asyncData ({ $axios }) {
    const [shuffleTheCards,] = await Promise.all([ 
      $axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'),
    ])

    return {
      shuffledCards: shuffleTheCards.data,
    }
  },

  methods: {
    async drawACard() {
      const card = await this.$axios.$get(`https://deckofcardsapi.com/api/deck/${this.shuffledCards.deck_id}/draw/?count=1`)
      this.current_card_img = card.cards[0].image
      console.log(card)
    }
  },

  mounted() {
    console.log(this.shuffledCards.deck_id)
  }


}
</script>
