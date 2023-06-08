import * as yup from 'yup';
import { reservationValidationSchema } from 'validationSchema/reservations';
import { tableLayoutValidationSchema } from 'validationSchema/table-layouts';
import { waiterValidationSchema } from 'validationSchema/waiters';

export const restaurantValidationSchema = yup.object().shape({
  name: yup.string().required(),
  organization_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
  reservation: yup.array().of(reservationValidationSchema),
  table_layout: yup.array().of(tableLayoutValidationSchema),
  waiter: yup.array().of(waiterValidationSchema),
});
