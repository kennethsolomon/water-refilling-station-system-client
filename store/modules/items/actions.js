import axios from 'axios';
export default{
	async callGetItems ({ commit }) {
		const items = await axios.get(`http://localhost:8000/api/items`)
		commit('SET_ITEMS', items.data)
	}
}