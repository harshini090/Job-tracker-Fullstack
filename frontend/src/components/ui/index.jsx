import React from 'react';

export function Input({ label, error, ...props }) {
    return (
        <div className="space-y-1">
            {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
            <input
                className={`w-full px-3 py-2 bg-white/50 backdrop-blur-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'
                    }`}
                {...props}
            />
            {error && <p className="text-xs text-red-600 animate-in slide-in-from-top-1">{error}</p>}
        </div>
    );
}

export function Button({ children, isLoading, variant = 'primary', className = '', ...props }) {
    const baseStyles = "w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "border-transparent shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 hover:shadow-indigo-500/30",
        secondary: "border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-indigo-500",
        danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : children}
        </button>
    );
}
