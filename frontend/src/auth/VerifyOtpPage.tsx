import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';

const VerifyOtpPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email from navigation state

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify-otp/`, { email, otp });

      if (response.data.success) {
        navigate('/'); // Redirect to homepage
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-72 mx-auto border px-3 py-6 rounded-md">
        <h1 className="text-xl text-center font-semibold">Verify OTP</h1>
        <div className="space-y-4 mt-4">
          <Input 
            type="number"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <Button onClick={handleVerifyOtp} className="w-full">Verify</Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
