import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import axios from "axios"
import { baseUrl } from "../../core"
import { GlobalContext } from "../context/Context";
import { useContext } from "react";
import Message from "../message/Message"
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  getImageListItemBarUtilityClass
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function Login() {
  const history = useHistory();
  const [messageBar, setMessageBar] = useState("")
  const [showPassword, setShowPassword] = useState();
  let { dispatch , state } = useContext(GlobalContext);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {

      console.log(values)
      axios.post(`${baseUrl}/api/v1/login`, {
        email: values.email,
        password: values.password,
      })
        .then((response) => {
          console.log(response.data);
          if (response.data === "No user is found with this email"
            || response.data === "Entered password is incorrect") {
            setMessageBar(false)
            setTimeout(() => {
              setMessageBar("")
            }, 3000);
          } else {
            dispatch({
            type: "USER_LOGIN",
            payload: {
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email,
            },
          });
            setMessageBar(true)
            setTimeout(() => {
              history.push("/profile")
            }, 1000);
          
          console.log(state.user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // if(values.email === user.email && values.password === user.password ){
      //   setMessageBar(true)
      //   setTimeout(() => {
      //     history.push("/profile")
      //   }, 1000);
      // }else{
      //   setMessageBar(false)
      //   setTimeout(() => {
      //     setMessageBar("")
      //   }, 3000);
      // }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
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
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
            {messageBar === true ? <Message type="success" message="Welcome" /> : ""}
          {messageBar === false ? (

            <Message type="error" message="Invalid email or password" />
          ) : (
            ""
          )}
          </Stack>
          

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
              label="Remember me"
            />

            <Link component={RouterLink} variant="subtitle2" to="#">
              Forgot password?
            </Link>
          </Stack>
          

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Login
          </LoadingButton>
        </Form>
      </FormikProvider>
    </>
  );
}