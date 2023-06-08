import * as yup from 'yup';

export const customerPreferenceValidationSchema = yup.object().shape({
  preference_name: yup.string().required(),
  preference_value: yup.string().required(),
  reservation_id: yup.string().nullable().required(),
});
