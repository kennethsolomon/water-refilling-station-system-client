import axios from 'axios';
export default{
	async callGetEmployees ({ commit }) {
		const employees = await axios.get(`http://localhost:8000/api/employees`)
		commit('SET_EMPLOYEES', employees.data)
	}
}