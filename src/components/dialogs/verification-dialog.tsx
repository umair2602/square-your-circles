import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface VerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: () => void;
  onPay: () => void;
}

const VerificationDialog = ({ open, onOpenChange, onVerify, onPay }: VerificationDialogProps) => {
  const { user } = useAuth();
  const isVerified = user?.isIdVerified;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{!isVerified ? 'Please choose' : 'Payment required'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {!isVerified && (
            <>
              <Button variant="outline" onClick={onVerify} className="w-full p-6">
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Verify ID</span>
                  <span className="text-sm text-muted-foreground">Verify ID to get a free submission</span>
                </div>
              </Button>

              <div className="text-center text-sm text-muted-foreground">or</div>
            </>
          )}

          <Button onClick={onPay} className="w-full p-6">
            <div className="flex flex-col items-center">
              <span className="font-semibold">Pay</span>
              <span className="text-sm text-gray-300">Pay to get a submission</span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
