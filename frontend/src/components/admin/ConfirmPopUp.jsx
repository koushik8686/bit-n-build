import React from 'react';

const ConfirmationPopup = ({ actionType, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">
          Are you sure you want to {actionType} this request?
        </h3>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`bg-${actionType === 'reject' ? 'red' : 'blue'}-600 hover:bg-${actionType === 'reject' ? 'red' : 'blue'}-700 text-white px-4 py-2 rounded`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
