/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';

/**
 * Internal dependencies
 */
import FormSelect from 'components/forms/form-select';

class ReduxFormSelect extends Component {
	static propTypes = {
		name: PropTypes.string,
	};

	renderSelect = ( { input: { onChange, value } } ) => (
		<FormSelect
			{ ...this.props }
			onChange={ this.updateSelect( onChange ) }
			value={ value } />
	)

	updateSelect = onChange => event => onChange( event.target.value );

	render() {
		return <Field component={ this.renderSelect } name={ this.props.name } />;
	}
}

export default ReduxFormSelect;
