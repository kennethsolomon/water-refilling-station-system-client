<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="py-4">
        <v-card-title class="headline">Currently Playing: {{playerInfo.name}}</v-card-title>
        <v-card-text
          >Card Remaining: <strong>{{ cardRemaining }}</strong></v-card-text
        >

        <v-row >
            <v-col cols="6"
              v-for="card in playerInfo.cards"
              :key="card.id"
            >
              <v-img
                :src="card.image"
              ></v-img>
            </v-col>
        </v-row>

        <div class="mt-5">
          <v-btn @click="drawACard('playing', 1)">Draw a Card</v-btn>
          <v-btn @click="drawACard('start', players.length * 2)">Start Game</v-btn>
          <v-btn @click="shuffle()">Shuffle</v-btn>
        </div>

      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  // Use if Global middleware is on inside nuxt.config and you want to exclude this page
  // auth: false

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

  data: () => ({
    shuffledCards: [],
    cardRemaining: 52,
    currentPlaying: 1,
    potMoney: null,
    drawnCard: null,
    players: [
      {
        id: 1,
        name: 'Kenneth',
        cards: [],
        bet: 0,
        money: 100,
      },
      {
        id: 2,
        name: 'Camille',
        cards: [],
        bet: 0,
        money: 100,
      },
      {
        id: 3,
        name: 'Mely',
        cards: [],
        bet: 0,
        money: 100,
      },
    ],
  }),

  computed: {
    playerInfo() {
      return this.players[this.currentPlaying-1]
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
    console.log(this.shuffledCards)
    console.log(this.players)
  },

  methods: {
    async drawACard(status, number) {
      this.$nuxt.$loading.start()
      const card = await this.$axios
        .$get(
          `https://deckofcardsapi.com/api/deck/${this.shuffledCards.deck_id}/draw/?count=${number}`
        )
        .then((response) => {
          this.$nuxt.$loading.finish()
          return response
        })

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

        // v2 Code
        // let start = 0
        // const chunkCount = 2
        // const chunks = card.cards.map((pair, i)=>{
        //   const chunk = card.cards.slice(i+start, i+(chunkCount+start));
        //   start+=1; return chunk;
        // })

        // const pair = chunks.filter(pair => {
        //   return pair.length !== 0
        // })

        console.log('Start', card)
      } else if (status === 'playing') {
        this.drawnCard = card.cards[0]
        console.log('Playing', card)
      }

      this.cardRemaining = card.remaining
    },

    async shuffle() {
      await this.$axios
        .$get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then((response) => {
          this.shuffledCards = response
          this.cardRemaining = response.remaining

          this.drawACard('start', this.players.length * 2)
          console.log('Shuffle', response)
        })
    },
  },
}
</script>
