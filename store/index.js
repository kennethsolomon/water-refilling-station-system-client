import Vuex from 'vuex';
import customers from './modules/customers';
import snackbar from './modules/snackbar';
import items from './modules/items';
import employees from './modules/employees';

const createStore = () => {
  return new Vuex.Store({
    namespaced: true,
    modules: {
      customers,
      snackbar,
      items,
      employees,
    }
  });
};

export default createStore