export default async function ({ store, from }) {
    const isInitialPageLoad = !from

    if (isInitialPageLoad) {
		await Promise.all([
			store.dispatch('callGetCustomers'),
			store.dispatch('callGetItems'),
			store.dispatch('callGetEmployees'),
		])
    }
}