import React from 'react';
import { Printer, X } from 'lucide-react';
import './Receipt.css';

const Receipt = ({ donation, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="receipt-container">
      <div className="receipt-actions no-print">
        <button onClick={handlePrint} className="print-btn" data-testid="print-receipt-button">
          <Printer size={20} />
          Print Receipt
        </button>
        <button onClick={onClose} className="close-btn" data-testid="close-receipt-button">
          <X size={20} />
          New Donation
        </button>
      </div>

      <div className="receipt" data-testid="donation-receipt">
        <div className={`receipt-watermark ${donation.paymentStatus.toLowerCase()}`}>
          {donation.paymentStatus === 'Received' ? 'PAID' : 'PENDING'}
        </div>

        <div className="receipt-header">
          <div className="temple-logo">🕉️</div>
          <h1>Mandir Donation Receipt</h1>
          <p className="temple-name">Sri Mandir Trust</p>
          <p className="temple-address">Temple Address Line 1, City, State - PIN</p>
        </div>

        <div className="receipt-number">
          <span>Receipt No:</span>
          <strong>{donation.receiptNumber}</strong>
        </div>

        <div className="receipt-body">
          <div className="receipt-section">
            <h3>Donor Details</h3>
            <div className="detail-row">
              <span className="label">Name:</span>
              <span className="value">{donation.donorName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Address:</span>
              <span className="value">{donation.address}</span>
            </div>
            <div className="detail-row">
              <span className="label">Phone:</span>
              <span className="value">{donation.phoneNumber}</span>
            </div>
          </div>

          <div className="receipt-section">
            <h3>Donation Details</h3>
            <div className="detail-row">
              <span className="label">Date:</span>
              <span className="value">{formatDate(donation.donationDate)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Type:</span>
              <span className="value">{donation.donationType}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status:</span>
              <span className="value">
                <span className={`status-badge ${donation.paymentStatus.toLowerCase()}`}>
                  {donation.paymentStatus}
                </span>
              </span>
            </div>
          </div>

          <div className="receipt-amount">
            <span>Total Amount:</span>
            <strong>{formatAmount(donation.amount)}</strong>
          </div>
        </div>

        <div className="receipt-footer">
          <p>Thank you for your generous donation!</p>
          <p className="blessing">May God bless you and your family</p>
          <div className="signature">
            <div className="signature-line"></div>
            <p>Authorized Signature</p>
          </div>
        </div>

        <div className="receipt-note">
          <p><strong>Note:</strong> This is a computer-generated receipt. Please keep it for your records.</p>
          {donation.paymentStatus === 'Pledged' && (
            <p className="pending-note">
              <strong>Important:</strong> This is a pledge receipt. Payment is pending. You will receive automated reminders after 15 days.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipt;