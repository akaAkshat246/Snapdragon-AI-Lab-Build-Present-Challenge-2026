/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";

export interface OtpInputProps {
  length?: number;
  onOtpSubmit?: (otp: string) => void;
  onChange?: (otp: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  value?: string;
  className?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 4,
  onOtpSubmit = () => {},
  onChange,
  disabled = false,
  autoFocus = true,
  isError = false,
  isSuccess = false,
  value,
  className = "",
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync with external value if provided
  useEffect(() => {
    if (value !== undefined) {
      const valArr = value.split("").slice(0, length);
      const newOtp = new Array(length).fill("");
      for (let i = 0; i < valArr.length; i++) {
        newOtp[i] = valArr[i];
      }
      setOtp(newOtp);
    }
  }, [value, length]);

  // Adjust array size if length prop changes
  useEffect(() => {
    setOtp((prev) => {
      if (prev.length === length) return prev;
      const next = new Array(length).fill("");
      for (let i = 0; i < Math.min(prev.length, length); i++) {
        next[i] = prev[i];
      }
      return next;
    });
  }, [length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Allow only numeric input
    const cleaned = rawVal.replace(/\D/g, "");
    if (!cleaned && rawVal !== "") return;

    const newOtp = [...otp];
    // allow only one input digit per box
    newOtp[index] = cleaned.substring(cleaned.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (onChange) {
      onChange(combinedOtp);
    }

    // Submit trigger when all boxes are filled
    if (combinedOtp.length === length) {
      onOtpSubmit(combinedOtp);
    }

    // Move to next input if current field is filled
    if (cleaned && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.setSelectionRange(1, 1);
    }

    // optional focus to first empty box if user clicks ahead
    if (index > 0 && !otp[index - 1]) {
      const firstEmptyIndex = otp.indexOf("");
      if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move focus to the previous input field on backspace
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        if (onChange) onChange(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (onChange) onChange(combinedOtp);

    if (combinedOtp.length === length) {
      onOtpSubmit(combinedOtp);
    }

    const focusIdx = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div
      className={`otp-container ${className}`}
      style={{
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        alignItems: "center",
        margin: "8px 0",
      }}
    >
      {otp.map((digitValue, index) => {
        const isFilled = digitValue !== "";
        let borderColor = isFilled ? '#10b981' : 'var(--border)';
        let bgColor = isFilled ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-secondary)';

        if (isError) {
          borderColor = '#ef4444';
          bgColor = 'rgba(239, 68, 68, 0.15)';
        } else if (isSuccess) {
          borderColor = '#10b981';
          bgColor = 'rgba(16, 185, 129, 0.2)';
        }

        return (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            ref={(input) => {
              inputRefs.current[index] = input;
            }}
            value={digitValue}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`otpInput ${isError ? 'otp-error' : ''} ${isSuccess ? 'otp-success' : ''}`}
            style={{
              width: '48px',
              height: '54px',
              fontSize: '22px',
              fontWeight: 800,
              fontFamily: 'JetBrains Mono, monospace, Inter, sans-serif',
              textAlign: 'center',
              borderRadius: '12px',
              border: `2px solid ${borderColor}`,
              backgroundColor: bgColor,
              color: 'var(--text-main)',
              boxShadow: isFilled
                ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                : '0 2px 6px rgba(0, 0, 0, 0.05)',
              outline: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: disabled ? 'not-allowed' : 'text',
            }}
          />
        );
      })}
    </div>
  );
};

export default OtpInput;
