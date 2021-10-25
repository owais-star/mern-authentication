import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useHistory } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from "axios"
import { baseUrl } from "../../core"
import Message from "../message/Message"
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const history = useHistory();
  const [messageBar, setMessageBar] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      //   navigate('/dashboard', { replace: true });
      // console.log(values)
      axios.post(`${baseUrl}/api/v1/registration`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      })
        .then((response) => {
          console.log(response.data)
          if (response.data === `User already registered.`) {
            setMessageBar(false)
            setTimeout(() => {
              setMessageBar("")
            }, 3000);
          } else {
            setMessageBar(true)
            setTimeout(() => {
              history.push("/login")
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="First name"
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />

              <TextField
                fullWidth
                label="Last name"
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
            </Stack>

            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
            {messageBar === true ? <Message type="success" message="Created Account Successfully" /> : ""}
            {messageBar === false ? (

              <Message type="error" message="An Account with this email is already Registered" />
            ) : (
              ""
            )}

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            // loading={isSubmitting}
            >
              Register
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}