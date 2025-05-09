'use client';

import { useState, MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Minimum 2 charaters')
    .max(50, 'Maximum 50 charaters')
    .required('Name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 charaters')
    .max(50, 'Maximum 50 charaters')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(100, 'Maximum 100 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get('from');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        setLoading(true);
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data?.message || 'Signup failed');
          return;
        }

        toast.success(data?.message || 'Signup successful');
        router.push(from ? `/login?from=${from}` : '/login');
      } catch (error: any) {
        console.error('Login error:', error);
        setStatus(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const togglePassword = (field: 'password' | 'confirm') => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
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
            <h3 className="text-xl font-semibold text-gray-900 leading-none mb-3">Sign up</h3>
            <div className="flex items-center justify-center font-medium">
              <span className="text-sm text-gray-600 me-1.5">Already have an account?</span>
              <Link
                href={from ? `/login?from=${from}` : '/login'}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-900">Name</label>
            <div className="relative">
              <input
                placeholder="Enter name"
                autoComplete="off"
                {...formik.getFieldProps('name')}
                className={clsx(
                  'w-full h-11 px-4 py-2 text-gray-900 placeholder-gray-500 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors',
                  {
                    'border-danger': formik.touched.name && formik.errors.name,
                    'border-gray-300': !(formik.touched.name && formik.errors.name)
                  }
                )}
              />
            </div>
            {/* {formik.touched.name && formik.errors.name && ( */}
              <span role="alert" className="text-danger text-xs h-2.5">
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500">{formik.errors.name}</p>
                )}
              </span>
            {/* )} */}
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
            {/* {formik.touched.email && formik.errors.email && ( */}
              <span role="alert" className="text-danger text-xs  h-2.5">
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500">{formik.errors.email}</p>
                )}
              </span>
            {/* )} */}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-900">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                autoComplete="new-password"
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
                onClick={togglePassword('password')}
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
            {/* {formik.touched.password && formik.errors.password && ( */}
              <span role="alert" className="text-danger text-xs  h-2.5">
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500">{formik.errors.password}</p>
                )}
              </span>
            {/* )} */}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-900">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                autoComplete="new-password"
                {...formik.getFieldProps('confirmPassword')}
                className={clsx(
                  'w-full h-11 px-4 py-2 text-gray-900 placeholder-gray-500 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors pr-11',
                  {
                    'border-danger': formik.touched.confirmPassword && formik.errors.confirmPassword,
                    'border-gray-300': !(formik.touched.confirmPassword && formik.errors.confirmPassword)
                  }
                )}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={togglePassword('confirm')}
              >
                {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
            {/* {formik.touched.confirmPassword && formik.errors.confirmPassword && ( */}
              <span role="alert" className="text-danger text-xs h-2.5">
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-red-500">{formik.errors.confirmPassword}</p>
                )}
              </span>
            {/* )} */}
          </div>

          <button
            type="submit"
            className="h-11 px-6 mt-2 text-white bg-blue-700 hover:bg-blue-900 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? 'Please wait...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
