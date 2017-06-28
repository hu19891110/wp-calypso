/**
 * External dependencies
 */
import { localize } from 'i18n-calypso';
import React, { Component, PropTypes } from 'react';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import OrderDetailsTable from './order-details-table';
import OrderFulfillment from './order-fulfillment';
import OrderRefundCard from './order-refund-card';
import SectionHeader from 'components/section-header';

class OrderDetails extends Component {
	static propTypes = {
		order: PropTypes.object.isRequired,
		site: PropTypes.shape( {
			ID: PropTypes.number.isRequired,
			slug: PropTypes.string.isRequired,
		} ),
	}

	state = {
		showRefundDialog: false,
	}

	toggleRefundDialog = () => {
		this.setState( {
			showRefundDialog: ! this.state.showRefundDialog,
		} );
	}

	render() {
		const { order, site, translate } = this.props;
		if ( ! order ) {
			return null;
		}

		return (
			<div className="order__details">
				<SectionHeader label={ translate( 'Order Details' ) } />
				<Card className="order__details-card">
					<OrderDetailsTable order={ order } site={ site } />
					<OrderRefundCard order={ order } site={ site } />
					<OrderFulfillment order={ order } site={ site } />
				</Card>
			</div>
		);
	}
}

export default localize( OrderDetails );
