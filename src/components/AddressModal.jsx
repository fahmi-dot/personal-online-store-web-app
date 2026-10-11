import React, { useState } from 'react';

export default function AddressModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    recipientName: initialData?.recipientName || '',
    phoneNumber: initialData?.phoneNumber || '',
    streetAddress: initialData?.streetAddress || '',
    city: initialData?.city || '',
    postalCode: initialData?.postalCode || '',
    label: initialData?.label || 'Home',
    isPrimary: initialData?.isPrimary || false,
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recipientName.trim() || !formData.phoneNumber.trim() || !formData.streetAddress.trim() || !formData.city.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      await onSave(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md border border-gray-200 shadow-xl p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-base font-extrabold uppercase tracking-tight text-gray-900">
            {initialData ? 'Edit Shipping Address' : 'Add New Shipping Address'}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-700 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
              Label (e.g. Home, Office) *
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="Home"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Fahmi"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="081234567890"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
              Street Address *
            </label>
            <textarea
              name="streetAddress"
              rows={2}
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="Jl. Merdeka No. 123, RT 01 / RW 02"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                City / Region *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Jakarta Selatan"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="12345"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPrimary"
              name="isPrimary"
              checked={formData.isPrimary}
              onChange={handleChange}
              className="accent-blue-600"
            />
            <label htmlFor="isPrimary" className="text-gray-700 font-semibold cursor-pointer">
              Set as primary shipping address
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
