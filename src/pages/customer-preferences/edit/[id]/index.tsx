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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getCustomerPreferenceById, updateCustomerPreferenceById } from 'apiSdk/customer-preferences';
import { Error } from 'components/error';
import { customerPreferenceValidationSchema } from 'validationSchema/customer-preferences';
import { CustomerPreferenceInterface } from 'interfaces/customer-preference';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ReservationInterface } from 'interfaces/reservation';
import { getReservations } from 'apiSdk/reservations';

function CustomerPreferenceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CustomerPreferenceInterface>(
    () => (id ? `/customer-preferences/${id}` : null),
    () => getCustomerPreferenceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CustomerPreferenceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCustomerPreferenceById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CustomerPreferenceInterface>({
    initialValues: data,
    validationSchema: customerPreferenceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Customer Preference
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'customer_preference',
  operation: AccessOperationEnum.UPDATE,
})(CustomerPreferenceEditPage);
