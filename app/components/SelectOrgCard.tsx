"use client";

import { admin_option } from "@/interfaces";

interface Props {
  admins: admin_option[];
  loading: boolean;
  onSelect: (admin_email: string) => void;
  onClose: () => void;
}

const SelectOrgCard = ({ admins, loading, onSelect, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0000005C] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">Choose an account</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-black text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Which organization account do you want to log in to?
        </p>

        <div className="flex flex-col gap-3 mt-5">
          {admins.map((a) => (
            <button
              key={a.admin_email}
              type="button"
              disabled={loading}
              onClick={() => onSelect(a.admin_email)}
              className="text-left border border-[#D7D7D7] rounded-lg px-4 py-3 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 disabled:opacity-50"
            >
              <div className="font-semibold text-[#546FFF]">
                {a.admin_name || a.admin_email}
              </div>
              {a.admin_name && (
                <div className="text-sm text-gray-500">{a.admin_email}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectOrgCard;
