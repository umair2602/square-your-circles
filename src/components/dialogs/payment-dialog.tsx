import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPay: () => void;
}

const PaymentDialog = ({ open, onOpenChange, onPay }: PaymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Payment required</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
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

export default PaymentDialog;
