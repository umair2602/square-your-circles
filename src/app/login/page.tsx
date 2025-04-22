'use client';

import { useState, MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 charaters')
    .max(50, 'Maximum 50 charaters')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 charaters')
    .max(50, 'Maximum 50 charaters')
    .required('Password is required'),
  remember: Yup.boolean()
});

const initialValues = {
  email: '',
  password: '',
  remember: true
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get('from');
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        setLoading(true);
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            rememberMe: values.remember
          })
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data?.message || 'Login failed');
          return;
        }

        login(data.user, data.token);
        router.push(from ? `/challenges` : '/');

        toast.success(data?.message || 'Login successful');
      } catch (error: any) {
        console.error('Login error:', error);
        setStatus(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const togglePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="card w-full max-w-[400px] border border-gray-300 shadow-sm rounded-xl">
        <form
          className="card-body flex flex-col gap-4 p-8 sm:p-10"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="text-center mb-2">
            <h3 className="text-xl font-semibold text-gray-900 leading-none mb-3">Log in</h3>
            <div className="flex items-center justify-center font-medium">
              <span className="text-sm text-gray-600 me-1.5">Need an account?</span>
              <Link
                href={from ? `/signup?from=${from}` : '/signup'}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-900">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter email"
                autoComplete="off"
                {...formik.getFieldProps('email')}
                className={clsx(
                  'w-full h-11 px-4 py-2 text-gray-900 placeholder-gray-500 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors',
                  {
                    'border-danger': formik.touched.email && formik.errors.email,
                    'border-gray-300': !(formik.touched.email && formik.errors.email)
                  }
                )}
              />
            </div>
            <span role="alert" className="text-danger text-xs h-2.5">
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500">{formik.errors.email}</p>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">Password</label>
              <Link
                href={'/reset-password'}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                autoComplete="off"
                {...formik.getFieldProps('password')}
                className={clsx(
                  'w-full h-11 px-4 py-2 text-gray-900 placeholder-gray-500 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors pr-11',
                  {
                    'border-danger': formik.touched.password && formik.errors.password,
                    'border-gray-300': !(formik.touched.password && formik.errors.password)
                  }
                )}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={togglePassword}
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
            <span role="alert" className="text-danger text-xs h-2.5">
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500">{formik.errors.password}</p>
              )}
            </span>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              checked={formik.values.remember}
              {...formik.getFieldProps('remember')}
            />
            <span className="text-sm text-gray-700">Remember me</span>
          </label>

          <button
            type="submit"
            className="h-11 px-6 mt-2 text-white bg-blue-700 hover:bg-blue-900 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? 'Please wait...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
