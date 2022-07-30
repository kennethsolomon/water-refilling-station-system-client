import Vuex from 'vuex';
import customers from './modules/customers';
import snackbar from './modules/snackbar';

const createStore = () => {
  return new Vuex.Store({
    namespaced: true,
    modules: {
      customers,
      snackbar,
    }
  });
};

export default createStore