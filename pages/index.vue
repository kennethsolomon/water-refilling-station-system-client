<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="py-4">
        <v-card-title class="headline">Card Game</v-card-title>
        <v-card-text
          >Card Remaining: <strong>{{ card_remaining }}</strong></v-card-text
        >
        <v-img
          :lazy-src="current_card_img"
          width="200px"
          :src="current_card_img"
        ></v-img>
        <v-btn @click="drawACard('playing', 1)">Draw a Card</v-btn>
        <v-btn @click="drawACard('start', players.length * 2)"
          >Start Game</v-btn
        >
        <v-btn @click="shuffle()">Shuffle</v-btn>
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
    shuffledCards: [],
    current_card_img: null,
    card_remaining: 52,
    pot_money: null,
    drawn_card: null,
    players: [
      {
        name: 'Kenneth',
        cards: [],
        bet: 0,
        money: 100,
      },
      {
        name: 'Camille',
        cards: [],
        bet: 0,
        money: 100,
      },
      {
        name: 'Mely',
        cards: [],
        bet: 0,
        money: 100,
      },
    ],
  }),

  async asyncData({ $axios }) {
    const [shuffledCards] = await Promise.all([
      $axios.get(
        'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
      ),
    ])

    return {
      shuffledCards: shuffledCards.data,
    }
  },

  methods: {
    async drawACard(status, number) {
      const card = await this.$axios
        .$get(
          `https://deckofcardsapi.com/api/deck/${this.shuffledCards.deck_id}/draw/?count=${number}`
        )
        .then((response) => response)

      if (status === 'start') {
        const chunk = 2
        let tempCard = []
        const distributedCards = []
        for (let i = 0, j = card.cards.length; i < j; i += chunk) {
          tempCard = card.cards.slice(i, i + chunk)
          distributedCards.push(tempCard)
        }

        this.players.forEach((player, index) => {
          player.cards = distributedCards[index]
        })

        console.log('Start', card)
      } else if (status === 'playing') {
        this.drawn_card = card.cards[0]
        console.log('Playing', card)
      }

      this.card_remaining = card.remaining
    },

    async shuffle() {
      await this.$axios
        .$get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then((response) => {
          this.shuffledCards = response
          this.card_remaining = response.remaining

          console.log('Shuffle', response)
        })
    },
  },

  mounted() {
    console.log(this.shuffledCards)
  },
}
</script>
