import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createCustomerPreference } from 'apiSdk/customer-preferences';
import { Error } from 'components/error';
import { customerPreferenceValidationSchema } from 'validationSchema/customer-preferences';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ReservationInterface } from 'interfaces/reservation';
import { getReservations } from 'apiSdk/reservations';
import { CustomerPreferenceInterface } from 'interfaces/customer-preference';

function CustomerPreferenceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CustomerPreferenceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCustomerPreference(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CustomerPreferenceInterface>({
    initialValues: {
      preference_name: '',
      preference_value: '',
      reservation_id: (router.query.reservation_id as string) ?? null,
    },
    validationSchema: customerPreferenceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Customer Preference
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="preference_name" mb="4" isInvalid={!!formik.errors?.preference_name}>
            <FormLabel>Preference Name</FormLabel>
            <Input
              type="text"
              name="preference_name"
              value={formik.values?.preference_name}
              onChange={formik.handleChange}
            />
            {formik.errors.preference_name && <FormErrorMessage>{formik.errors?.preference_name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="preference_value" mb="4" isInvalid={!!formik.errors?.preference_value}>
            <FormLabel>Preference Value</FormLabel>
            <Input
              type="text"
              name="preference_value"
              value={formik.values?.preference_value}
              onChange={formik.handleChange}
            />
            {formik.errors.preference_value && <FormErrorMessage>{formik.errors?.preference_value}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ReservationInterface>
            formik={formik}
            name={'reservation_id'}
            label={'Select Reservation'}
            placeholder={'Select Reservation'}
            fetcher={getReservations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.customer_id}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'customer_preference',
  operation: AccessOperationEnum.CREATE,
})(CustomerPreferenceCreatePage);
