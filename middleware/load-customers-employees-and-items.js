export default async function ({ store, from }) {
    const isInitialPageLoad = !from

    if (isInitialPageLoad) {
      await store.dispatch('callGetCustomers')
      await store.dispatch('callGetItems')
      await store.dispatch('callGetEmployees')
    }
}