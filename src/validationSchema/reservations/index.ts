import * as yup from 'yup';
import { customerPreferenceValidationSchema } from 'validationSchema/customer-preferences';

export const reservationValidationSchema = yup.object().shape({
  reservation_date: yup.date().required(),
  customer_id: yup.string().nullable().required(),
  restaurant_id: yup.string().nullable().required(),
  table_layout_id: yup.string().nullable().required(),
  customer_preference: yup.array().of(customerPreferenceValidationSchema),
});
