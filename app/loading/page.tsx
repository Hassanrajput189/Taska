import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        backgroundColor: "#0000005C", // gray
        fontFamily: "system-ui, sans-serif",
        color: "#374151",
      }}
    >
      <style>{`
        @keyframes loading-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          width: 48,
          height: 48,
          border: "5px solid #9ca3af",
          borderTopColor: "#374151",
          borderRadius: "50%",
          animation: "loading-spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: 16 }}>Loading...</span>
    </div>
  );
};

export default LoadingPage;