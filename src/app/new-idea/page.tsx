'use client';
import React from 'react';
import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTitle, setDescription, setW3wLocation, setCitedIdeas, resetForm } from '@/store/slices/ideaCreationSlice';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UsernameMenu from '@/components/common/username-menu';
import VerificationDialog from '@/components/dialogs/verification-dialog';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import CarbonCount from '@/components/common/CarbonCount';
import { useAuth } from '@/context/AuthContext';
import { FaRedo } from 'react-icons/fa';

const ideaSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
});

const page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const { title, description, w3wlocation, citedIdeas } = useSelector((state: any) => state.ideaCreation);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: title || '',
      description: description || '',
      // w3wlocation: w3wlocation || '',
      // citedIdeas: citedIdeas || [],
    },
    // validationSchema: ideaSchema,
    onSubmit: async (values) => {
      if (!captchaToken) {
        toast.error('Please verify you are human');
        return;
      }

      // const response = await fetch('/api/verify-captcha', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: captchaToken }),
      // });

      // const result = await response.json();

      // if (!response.ok) {
      //   toast.error('CAPTCHA verification failed. Please try again.');
      //   recaptchaRef.current?.reset();
      //   setCaptchaToken(null);
      //   return;
      // }

      dispatch(setTitle(values.title));
      dispatch(setDescription(values.description));
      // dispatch(setW3wLocation(values.w3wlocation));
      // dispatch(setCitedIdeas(values.citedIdeas));
      // if (user) {
      //   setShowVerificationDialog(true);
      // } else {
      //   router.push('/login?from=form');
      // }
      router.push('/challenges');

      // recaptchaRef.current?.reset();
      // setCaptchaToken(null);
    },
  });

  const handleVerify = () => {
    console.log('Verifying...');
    setShowVerificationDialog(false);
  };

  const handlePay = () => {
    setShowVerificationDialog(false);
    router.push('/payment');
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <UsernameMenu />
        <div>
          <CarbonCount />
        </div>
      </div>
      <div className="flex grow items-center justify-center">
        <form onSubmit={formik.handleSubmit} className="w-full max-w-lg">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl mb-2 flex items-center gap-2 justify-between">
                <div>Create New Idea</div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(resetForm());
                    formik.resetForm({
                      values: {
                        title: '',
                        description: '',
                      },
                    });
                  }}
                >
                  <FaRedo />
                </Button>
              </CardTitle>
              <CardDescription>Fill in the details of your new idea</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Title" {...formik.getFieldProps('title')} className={`${formik.touched.title && formik.errors.title ? 'border-red-500' : ''}`} />
                <div className="h-4">{formik.touched.title && formik.errors.title && <p className="text-red-500 text-xs">{String(formik.errors.title)}</p>}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Description" {...formik.getFieldProps('description')} className={`${formik.touched.description && formik.errors.description ? 'border-red-500' : ''} h-20`} />
                <div className="h-4">{formik.touched.description && formik.errors.description && <p className="text-red-500 text-xs">{String(formik.errors.description)}</p>}</div>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="w3wlocation">W3W Location</Label>
                <Input id="w3wlocation" placeholder="W3W Location" {...formik.getFieldProps('w3wlocation')} className={`${formik.touched.w3wlocation && formik.errors.w3wlocation ? 'border-red-500' : ''}`} />
                <div className="h-4">{formik.touched.w3wlocation && formik.errors.w3wlocation && <p className="text-red-500 text-xs">{String(formik.errors.w3wlocation)}</p>}</div>
              </div> */}

              {/* <div className="space-y-2">
                <Label>Cite idea</Label>
                <Select
                  value={formik.values.citedIdeas[0] || 'none'}
                  onValueChange={(value) => {
                    if (value === 'none') {
                      formik.setFieldValue('citedIdeas', []);
                    } else {
                      formik.setFieldValue('citedIdeas', [value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select idea to be cited" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="idea1">Idea 1</SelectItem>
                    <SelectItem value="idea2">Idea 2</SelectItem>
                    <SelectItem value="idea3">Idea 3</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </CardContent>
          </Card>
          <div className="flex justify-end mt-3.5">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={`${process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY}`}
              onChange={handleCaptchaChange}
              onExpired={() => {
                setCaptchaToken(null);
              }}
            />
            <Button
              type="submit"
              className="bg-gray-500 hover:bg-gray-900 text-white ml-4"
              // disabled={formik.isSubmitting}
            >
              Next
            </Button>
          </div>
        </form>
      </div>
      <VerificationDialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog} onVerify={handleVerify} onPay={handlePay} />
    </div>
  );
};

export default page;
