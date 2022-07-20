import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required, email, max, min, digits, regex } from 'vee-validate/dist/rules';

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

// TODO: Remove unused rules
extend('digits', {
	...digits,
	message: '{_field_} needs to be {length} digits. (eg. 09123456789)',
})

extend('required', {
	...required,
	message: '{_field_} can not be empty.',
})

extend('max', {
	...max,
	message: '{_field_} may not be greater than {length} characters',
})

extend('min', {
	...min,
	message: '{_field_} may not be less than {length} characters',
})

extend('regex', {
	...regex,
	message: '{_field_} {_value_} does not match {regex}',
})

extend('email', {
	...email,
	message: 'Email must be valid',
})

extend('password', {
	params: ['target'],
	validate(value, { target }) {
		return value === target;
	},
	message: 'Password confirmation does not match'
});