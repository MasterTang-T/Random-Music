import Vue from 'vue';
import App from './App.vue'
import Axios from 'axios'
import loading from '../components/loading'
Vue.prototype.$axios = Axios;
Vue.use(loading)
new Vue({
    el: '#app',
    render: h => h(App)
})