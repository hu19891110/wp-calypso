/**
 * External dependencies
 */
import { renderWithReduxStore } from 'lib/react-helpers';
import React from 'react';
import page from 'page';

/**
 * Internal dependencies
 */
import route from 'lib/route';
import CommentsManagement from './main';
import controller from 'my-sites/controller';

export const isStatusValid = status => {
	const validStatuses = [ 'pending', 'approved', 'spam', 'trash', 'all' ];
	return validStatuses.indexOf( status ) !== -1;
};

export const comments = function( context ) {
	const status = context.params.status;
	const siteSlug = route.getSiteFragment( context.path );

	if ( ! isStatusValid( status ) && ! siteSlug ) {
		page.redirect( '/comments' );
	}

	if ( ! isStatusValid( status ) && siteSlug ) {
		page.redirect( `/comments/pending/${ siteSlug }` );
	}

	if ( ! siteSlug ) {
		page.redirect( `/comments/${ status }` );
	}

	renderWithReduxStore(
		<CommentsManagement
			basePath={ context.path }
			siteSlug={ siteSlug }
			status={ 'pending' === status ? 'unapproved' : status }
		/>,
		'primary',
		context.store
	);
};

export const sites = function( context ) {
	const { status } = context.params;
	const siteSlug = route.getSiteFragment( context.path );

	if ( status === siteSlug ) {
		return page.redirect( `/comments/pending/${ siteSlug }` );
	}

	if ( ! isStatusValid( status ) ) {
		return page.redirect( '/comments' );
	}

	controller.sites( context );
};
