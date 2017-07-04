/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { formValueSelector, reduxForm } from 'redux-form';
import { localize } from 'i18n-calypso';
import { flowRight } from 'lodash';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import FormButton from 'components/forms/form-button';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import ReduxFormRadio from 'components/redux-forms/redux-form-radio';
import ReduxFormSelect from 'components/redux-forms/redux-form-select';
import ReduxFormTextInput from 'components/redux-forms/redux-form-text-input';
import ReduxFormToggle from 'components/redux-forms/redux-form-toggle';
import SectionHeader from 'components/section-header';

const JobSubmission = ( { duration, translate } ) => {
	return (
		<div>
			<SectionHeader label={ translate( 'Account' ) }>
				<FormButton compact primary />
			</SectionHeader>
			<Card>
				<form>
					<FormFieldset>
						<ReduxFormToggle
							name="job_manager_user_requires_account"
							text={ translate( 'Submitting listings requires an account' ) } />
						<FormSettingExplanation isIndented>
							{ translate( 'Non-logged in users will be unable to submit listings without creating an account.' ) }
						</FormSettingExplanation>

						<ReduxFormToggle
							name="job_manager_enable_registration"
							text={ translate( 'Allow account creation' ) } />
						<FormSettingExplanation isIndented>
							{ translate( 'Non-logged in users will be able to create an account by entering ' +
								'their email address on the submission form.' ) }
						</FormSettingExplanation>

						<ReduxFormToggle
							name="job_manager_generate_username_from_email"
							text="Automatically generate username from email address" />
						<FormSettingExplanation isIndented>
							{ translate( 'A username will be generated from the first part of the ' +
								'user email address. Otherwise, a username field will be shown.' ) }
						</FormSettingExplanation>
					</FormFieldset>

					<FormFieldset>
						<FormLabel>
							{ translate( 'Role' ) }
						</FormLabel>
						<ReduxFormSelect name="job_manager_registration_role">
							<option value="editor">{ translate( 'Editor' ) }</option>
							<option value="author">{ translate( 'Author' ) }</option>
							<option value="contributor">{ translate( 'Contributor' ) }</option>
							<option value="subscriber">{ translate( 'Subscriber' ) }</option>
							<option value="teacher">{ translate( 'Teacher' ) }</option>
							<option value="employer">{ translate( 'Employer' ) }</option>
							<option value="customer">{ translate( 'Customer' ) }</option>
							<option value="shop_manager">{ translate( 'Shop manager' ) }</option>
						</ReduxFormSelect>
						<FormSettingExplanation>
							{ translate( 'If you enable registration on your submission form, choose a role for the new user.' ) }
						</FormSettingExplanation>
					</FormFieldset>
				</form>
			</Card>

			<SectionHeader label={ translate( 'Approval' ) }>
				<FormButton compact primary />
			</SectionHeader>
			<Card>
				<form>
					<FormFieldset>
						<ReduxFormToggle
							name="job_manager_submission_requires_approval"
							text={ translate( 'New listing submissions require admin approval' ) } />
						<FormSettingExplanation isIndented>
							{ translate( 'New submissions will be inactive, pending admin approval.' ) }
						</FormSettingExplanation>

						<ReduxFormToggle
							name="job_manager_user_can_edit_pending_submissions"
							text="Submissions awaiting approval can be edited" />
						<FormSettingExplanation isIndented>
							{ translate( 'Submissions awaiting admin approval can be edited by the user.' ) }
						</FormSettingExplanation>
					</FormFieldset>
				</form>
			</Card>

			<SectionHeader label={ translate( 'Listing Duration' ) }>
				<FormButton compact primary />
			</SectionHeader>
			<Card>
				<form>
					<FormFieldset>
						{ translate(
							'Display listings for {{days /}} day before expiring',
							'Display listings for {{days /}} days before expiring',
							{
								count: duration,
								components: {
									days:
										<ReduxFormTextInput
											min="0"
											name="job_manager_submission_duration"
											step="1"
											type="number" />
								}
							}
						) }
						<FormSettingExplanation>
							{ translate( 'Can be left blank to never expire.' ) }
						</FormSettingExplanation>
					</FormFieldset>
				</form>
			</Card>

			<SectionHeader label={ translate( 'Application Method' ) }>
				<FormButton compact primary />
			</SectionHeader>
			<Card>
				<form>
					<FormFieldset>
						<FormSettingExplanation>
							{ translate( 'Choose the contact method for listings.' ) }
						</FormSettingExplanation>
						<FormLabel>
							<ReduxFormRadio
								name="job_manager_allowed_application_method"
								value="" />
							<span>
								{ translate( 'Email address or website URL' ) }
							</span>
						</FormLabel>

						<FormLabel>
							<ReduxFormRadio
								name="job_manager_allowed_application_method"
								value="email" />
							<span>
								{ translate( 'Email addresses only' ) }
							</span>
						</FormLabel>

						<FormLabel>
							<ReduxFormRadio
								name="job_manager_allowed_application_method"
								value="url" />
							<span>
								{ translate( 'Website URLs only' ) }
							</span>
						</FormLabel>
					</FormFieldset>
				</form>
			</Card>
		</div>
	);
};

JobSubmission.propTypes = {
	translate: PropTypes.func,
};

const connectComponent = connect(
	( state ) => {
		const selector = formValueSelector( 'submission', () => state.extensions.wpJobManager.form );

		return {
			duration: selector( state, 'job_manager_submission_duration' ),
		};
	}
);

const createReduxForm = reduxForm( {
	enableReinitialize: true,
	form: 'submission',
	getFormState: state => state.extensions.wpJobManager.form,
} );

export default flowRight(
	connectComponent,
	localize,
	createReduxForm,
)( JobSubmission );
