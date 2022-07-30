import Vuex from 'vuex';
import customers from './modules/customers';

const createStore = () => {
  return new Vuex.Store({
    namespaced: true,
    modules: {
      customers,
    }
  });
};

export default createStore