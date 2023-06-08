import * as yup from 'yup';
import { reservationValidationSchema } from 'validationSchema/reservations';

export const tableLayoutValidationSchema = yup.object().shape({
  layout_name: yup.string().required(),
  restaurant_id: yup.string().nullable().required(),
  reservation: yup.array().of(reservationValidationSchema),
});
