import axios from 'axios';
export default{
	async callGetCustomers ({ commit }) {
		const customers = await axios.get('http://localhost:8000/api/customers')
		commit('SET_CUSTOMERS', customers.data)
	}
}