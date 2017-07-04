/**
 * Internal dependencies
 */
import {
	GRAVATAR_UPLOAD_RECEIVE,
	GRAVATAR_UPLOAD_REQUEST,
	GRAVATAR_UPLOAD_REQUEST_SUCCESS,
	GRAVATAR_UPLOAD_REQUEST_FAILURE,
} from 'state/action-types';
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import {
	bumpStat,
	composeAnalytics,
	recordTracksEvent,
	withAnalytics,
} from 'state/analytics/actions';

export function uploadGravatar( { dispatch }, action ) {
	const { email, file } = action;
	dispatch( http( {
		method: 'POST',
		path: '/gravatar-upload',
		body: {},
		apiNamespace: 'wpcom/v2',
		formData: [
			[ 'account', email ],
			[ 'filedata', file ],
		],
	}, action ) );
}

export function announceSuccess( { dispatch }, { file }, next, data ) {
	// Return a Promise for testing purposes
	return new Promise( ( resolve, reject ) => {
		// Sometimes wpcom-proxy-request reports a failed connection as a success, so
		// we test for the response here. See
		// https://github.com/Automattic/wp-calypso/pull/15636#issuecomment-312860944
		if ( ! data.success ) {
			announceFailure( { dispatch } );
			return reject();
		}

		const fileReader = new FileReader( file );
		fileReader.addEventListener( 'load', () => {
			resolve( fileReader.result );
		} );
		fileReader.readAsDataURL( file );
	} )
		.then( ( fileReaderData ) => {
			dispatch( {
				type: GRAVATAR_UPLOAD_RECEIVE,
				src: fileReaderData,
			} );
			dispatch( withAnalytics(
				recordTracksEvent( 'calypso_edit_gravatar_upload_success' ),
				{ type: GRAVATAR_UPLOAD_REQUEST_SUCCESS }
			) );
		} );
}

export function announceFailure( { dispatch } ) {
	dispatch( withAnalytics(
		composeAnalytics(
			recordTracksEvent( 'calypso_edit_gravatar_upload_failure' ),
			bumpStat( 'calypso_gravatar_update_error', 'unsuccessful_http_response' )
		),
		{ type: GRAVATAR_UPLOAD_REQUEST_FAILURE }
	) );
}

export default {
	[ GRAVATAR_UPLOAD_REQUEST ]: [ dispatchRequest( uploadGravatar, announceSuccess, announceFailure ) ],
};
