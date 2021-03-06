/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import getPostRevisions from 'state/selectors/get-post-revisions';

describe( 'getPostRevisions', () => {
	it( 'should return an empty array if there is no revision in the state for `siteId, postId`', () => {
		expect( getPostRevisions( {
			posts: {
				revisions: {
					revisions: {},
				},
			},
			users: {
				items: {},
			},
		}, 12345678, 10 ) ).to.eql( [] );
	} );

	it( 'should return an array of post revisions', () => {
		expect( getPostRevisions( {
			posts: {
				revisions: {
					revisions: {
						12345678: {
							10: {
								11: {
									id: 11,
									title: 'Badman <img onerror= />',
								},
							},
						},
					},
				},
			},
			users: {
				items: {},
			},
		}, 12345678, 10 ) ).to.eql( [
			{
				id: 11,
				title: 'Badman <img onerror= />',
			},
		] );
	} );

	it( 'should hydrate all revisions with more author information if found', () => {
		expect( getPostRevisions( {
			posts: {
				revisions: {
					revisions: {
						12345678: {
							10: {
								11: {
									id: 11,
									author: 1,
								},
								12: {
									id: 12,
									author: 2,
								},
							},
						},
					},
				},
			},
			users: {
				items: {
					1: {
						name: 'Alice Bob'
					},
					2: {
						name: 'Carol Dan',
					},
				},
			},
		}, 12345678, 10 ) ).to.eql( [
			{
				id: 11,
				author: {
					name: 'Alice Bob',
				},
			},
			{
				id: 12,
				author: {
					name: 'Carol Dan',
				},
			},
		] );
	} );

	it( 'should preserve all revisions author ID if not found', () => {
		expect( getPostRevisions( {
			posts: {
				revisions: {
					revisions: {
						12345678: {
							10: {
								11: {
									id: 11,
									author: 1,
								},
								12: {
									id: 12,
									author: 2,
								}
							},
						},
					},
				},
			},
			users: {
				items: {},
			},
		}, 12345678, 10 ) ).to.eql( [
			{
				id: 11,
				author: 1,
			},
			{
				id: 12,
				author: 2,
			}
		] );
	} );
} );
