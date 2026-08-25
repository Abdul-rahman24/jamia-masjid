import { Card, CardContent } from '../components/ui/Card';
import { Building2, CreditCard, Heart, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Donations() {
  const { donationInfo } = useData();
  const donation = donationInfo;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Support the Masjid</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          "Those who spend their wealth in charity day and night, secretly and openly—their reward is with their Lord..." (Quran 2:274)
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-start gap-3 text-yellow-800">
        <AlertCircle size={24} className="flex-shrink-0 text-yellow-600" />
        <div>
          <p className="font-semibold mb-1">Important Notice</p>
          <p className="text-sm">
            This website currently provides donation information only. No payments are processed directly through this site. Please verify the official donation details below before making a transfer.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {donation.upiId && (
          <Card className="border-t-4 border-t-[var(--color-primary)]">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="text-[var(--color-primary)]" /> UPI Payment
              </h2>
              
              <div className="text-center mb-6">
                {donation.qrCodeUrl ? (
                  <img src={donation.qrCodeUrl} alt="UPI QR Code" className="mx-auto w-48 h-48 rounded-lg border shadow-sm mb-4" />
                ) : (
                  <div className="mx-auto w-48 h-48 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center mb-4 text-gray-400 flex-col">
                    <span className="text-sm font-medium">QR Code Placeholder</span>
                  </div>
                )}
                
                <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-1">UPI ID</p>
                <p className="text-lg font-bold text-gray-900">{donation.upiId}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-t-4 border-t-gray-800">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="text-gray-700" /> Bank Transfer
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase">Account Name</p>
                <p className="font-bold text-gray-900 text-lg">{donation.accountName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase">Bank Name</p>
                <p className="font-medium text-gray-900">{donation.bankName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase">Account Number</p>
                <p className="font-mono font-bold text-xl text-gray-900 bg-gray-50 p-2 rounded inline-block">{donation.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase">IFSC Code</p>
                <p className="font-mono font-bold text-lg text-gray-900 bg-gray-50 p-2 rounded inline-block">{donation.ifsc}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-100">
        <p className="mb-2 font-medium">{donation.instructions}</p>
        <p className="text-sm">For donation related queries, contact: <span className="font-bold text-gray-900">{donation.contactPerson}</span></p>
      </div>
    </div>
  );
}
