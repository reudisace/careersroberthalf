import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";

const STEPS = ["Verify", "Schedule", "Finish"];

const ApplicationComplete = () => {
  const router = useRouter();
  const [imageError, setImageError] = React.useState(false);
  
  const appointmentData = typeof window !== "undefined" 
    ? JSON.parse(sessionStorage.getItem("appointmentData") || "{}") 
    : {};

  const {
    selectedAgent,
    scheduledDate,
    scheduledTime,
    jobInterests = [],
    workPreferences = [],
    dates = [],
    userEmail = "",
    userData = {}
  } = appointmentData;

  useEffect(() => {
    if (!selectedAgent || !scheduledDate || !scheduledTime) {
      router.push("/");
      return;
    }

    // Send confirmation email
    const sendConfirmationEmail = async () => {
      try {

        if (!userEmail) {
          console.error("No email address found!");
          return;
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/send-confirmation`, {
          email: userEmail,
          agentName: selectedAgent.name,
          agentTitle: selectedAgent.title,
          scheduledDate,
          scheduledTime,
          jobInterests,
          workPreferences,
          ...userData
        });

      } catch (error) {
        console.error("Error sending confirmation email:", error);
        console.error("Error details:", error.response?.data || error.message);
      }
    };

    sendConfirmationEmail();
  }, []);

  const handleDoneClick = () => {
    sessionStorage.removeItem("appointmentData");
    window.location.href = 'https://www.roberthalf.com/us/en';
  };

  const selectedDateInfo = dates.find(d => d.date === scheduledDate) || {};

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 font-sans">
      <main className="flex-grow w-full flex flex-col items-center">
        <div className="bg-gray-50 flex w-full justify-center items-center py-4 sm:py-6 lg:py-8 px-2 sm:px-4">
          <div className="bg-white max-w-5xl w-full rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
            
            {/* Professional Header */}
            <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-gray-200 py-6 sm:py-8 px-4 sm:px-6 lg:px-10">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  {process.env.NEXT_PUBLIC_APP_NAME || "Tesla Careers"}
                </h1>
                <span className="text-gray-400 font-light text-2xl sm:text-3xl hidden sm:inline">×</span>
                <div className="relative w-28 h-10 sm:w-36 sm:h-12">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1580.91 381.52" className="w-full h-full">
                    <defs>
                      <style>{`.cls-1{fill:#006bff;}.cls-2{fill:#0ae8f0;}`}</style>
                    </defs>
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="Logo_assets" data-name="Logo assets">
                        <g id="Wordmark">
                          <path className="cls-1" d="M938.46,150.54c24.52,0,47.74,15,52.64,47.41H881.9c4.57-28.44,25.83-47.41,56.56-47.41m49.15,95.36c-8.34,13-24.46,23-46.53,23-30.41,0-53.63-16.67-59.18-46.1h137a83,83,0,0,0,1-12.75c0-45.77-32-86.32-81.42-86.32-51,0-85.66,37.6-85.66,86,0,49,35,86,87.62,86,32.7,0,57.55-14.72,71.93-37Z"/>
                          <rect className="cls-1" x="810.92" y="52.78" width="28.44" height="238.69"/>
                          <path className="cls-1" d="M1178.15,191.09V291.46H1149.7V192.72c0-26.81-15.36-41.85-40.54-41.85-26.16,0-47.41,15.37-47.41,53.95v86.64H1033.3V128h28.45v23.54c12.1-19.29,30.08-27.79,53-27.79,38.25,0,63.43,25.5,63.43,67.36"/>
                          <path className="cls-1" d="M1335,209.72c0-33.35-25.18-58.53-58.2-58.53-32.7,0-57.87,25.18-57.87,58.53s25.17,58.53,57.87,58.53c33,0,58.2-25.18,58.2-58.53m28.44-156.94V291.47H1335V263.34c-13.08,20-34,32.38-61.8,32.38-45.45,0-82.72-37.61-82.72-86s37.27-86,82.72-86c27.79,0,48.72,12.42,61.8,32.37V52.78Z"/>
                          <rect className="cls-1" x="1386.38" y="52.78" width="28.44" height="238.69"/>
                          <path className="cls-1" d="M760.22,209.72c0-33.35-25.17-58.53-58.2-58.53-32.69,0-57.87,25.18-57.87,58.53s25.18,58.53,57.87,58.53c33,0,58.2-25.18,58.2-58.53M788.67,128V291.46H760.22V263.34c-13.08,20-34,32.38-61.79,32.38-45.45,0-82.73-37.61-82.73-86s37.28-86,82.73-86c27.79,0,48.71,12.42,61.79,32.37V128Z"/>
                          <path className="cls-1" d="M573.51,260a88.53,88.53,0,1,1,25.6-151.42,87,87,0,0,1,13.48,13.92l24.61-18a119.17,119.17,0,1,0-21.72,166.65L599.1,245.25A89.32,89.32,0,0,1,573.51,260"/>
                          <path className="cls-1" d="M1552.12,128v92.78c0,30-17.45,49-44.09,49s-45.93-19-45.93-49V128h-28.78v90c0,47.16,29.39,77.78,74.71,77.78,39.2,0,45.32-24.8,45.32-25.42v33.38c0,33.07-14.39,51.75-44.4,51.75a44.19,44.19,0,0,1-44-38.2l-25.73,9A71.53,71.53,0,0,0,1509,381.52c46.54,0,72-30.63,72-77.78V128Z"/>
                        </g>
                        <g id="Brand_mark" data-name="Brand mark">
                          <path className="cls-1" d="M231.58,223.23C220.65,232.93,207,245,182.25,245h-14.8c-17.91,0-34.2-6.51-45.86-18.31-11.39-11.53-17.66-27.31-17.66-44.44V162c0-17.13,6.27-32.91,17.66-44.44,11.66-11.8,27.95-18.3,45.86-18.3h14.8c24.78,0,38.4,12.06,49.33,21.76,11.35,10,21.14,18.74,47.25,18.74a75.11,75.11,0,0,0,11.89-.95l-.09-.23a89.53,89.53,0,0,0-5.49-11.28L267.69,97.07a89.65,89.65,0,0,0-77.64-44.82H155.14A89.65,89.65,0,0,0,77.5,97.07L60.05,127.3a89.67,89.67,0,0,0,0,89.65L77.5,247.18A89.65,89.65,0,0,0,155.14,292h34.91a89.65,89.65,0,0,0,77.64-44.82L285.14,217a89.53,89.53,0,0,0,5.49-11.28l.09-.22a74,74,0,0,0-11.89-1c-26.11,0-35.9,8.69-47.25,18.74"/>
                          <path className="cls-1" d="M182.25,117.61h-14.8c-27.26,0-45.17,19.47-45.17,44.39v20.25c0,24.92,17.91,44.39,45.17,44.39h14.8c39.72,0,36.6-40.5,96.58-40.5a91.64,91.64,0,0,1,16.94,1.56,89.54,89.54,0,0,0,0-31.15,92.51,92.51,0,0,1-16.94,1.56c-60,0-56.86-40.5-96.58-40.5"/>
                          <path className="cls-1" d="M330.23,202.5a83.62,83.62,0,0,0-34.45-14.81c0,.11,0,.2,0,.3a89.7,89.7,0,0,1-5,17.45,65.58,65.58,0,0,1,28.48,11.73c0,.08-.05.18-.08.27a153.57,153.57,0,1,1,0-90.63c0,.09.05.19.08.27a65.45,65.45,0,0,1-28.48,11.72,90.3,90.3,0,0,1,5,17.47,2.33,2.33,0,0,0,0,.28,83.6,83.6,0,0,0,34.45-14.8c9.82-7.27,7.92-15.48,6.43-20.34a172.13,172.13,0,1,0,0,101.43c1.49-4.86,3.39-13.07-6.43-20.34"/>
                          <path className="cls-2" d="M290.72,138.8a74,74,0,0,1-11.89,1c-26.11,0-35.9-8.69-47.24-18.74-10.94-9.7-24.56-21.77-49.34-21.77h-14.8c-17.92,0-34.2,6.51-45.86,18.31-11.39,11.53-17.66,27.31-17.66,44.44v20.25c0,17.13,6.27,32.91,17.66,44.44,11.66,11.8,27.94,18.3,45.86,18.3h14.8c24.78,0,38.4-12.06,49.34-21.76,11.34-10,21.13-18.74,47.24-18.74a75.11,75.11,0,0,1,11.89.95,89,89,0,0,0,5-17.45,2.68,2.68,0,0,0,0-.3,92.51,92.51,0,0,0-16.94-1.55c-60,0-56.86,40.51-96.58,40.51h-14.8c-27.26,0-45.17-19.48-45.17-44.4V162c0-24.92,17.91-44.39,45.17-44.39h14.8c39.72,0,36.6,40.49,96.58,40.49a91.64,91.64,0,0,0,16.94-1.55c0-.09,0-.18,0-.28a90.3,90.3,0,0,0-5-17.47"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
              <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                Powered by Calendly Scheduling
              </p>
            </div>
            
            {/* Main Content */}
            <div className="p-4 sm:p-6 lg:p-10 text-center flex flex-col gap-6 items-center py-8 sm:py-12 lg:py-16">

              {/* STEPPER */}
              <div className="flex items-start justify-center gap-0 mb-4 sm:mb-6">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex items-center">
                    {/* Left extending line before first step */}
                    {i === 0 && (
                      <div className="relative w-8 sm:w-12 lg:w-16 h-0.5 mb-6 mr-0">
                        <div className="absolute inset-0 bg-gray-300" />
                        <div className="absolute right-0 top-0 h-full w-full bg-[#00A3FF]" />
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold shadow-sm transition-all relative z-10 ${
                        i <= 2 ? 'bg-[#00A3FF] text-white' : 'bg-gray-300 text-gray-500'
                      }`}>
                        {i === 0 && (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        )}
                        {i === 1 && (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                          </svg>
                        )}
                        {i === 2 && (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-medium mt-2 whitespace-nowrap ${
                        i <= 2 ? 'text-[#00A3FF]' : 'text-gray-400'
                      }`}>
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="relative w-16 sm:w-20 lg:w-28 h-0.5 mb-6">
                        <div className="absolute inset-0 bg-gray-300" />
                        <div className={`absolute left-0 top-0 h-full transition-all ${i < 2 ? 'w-full bg-[#00A3FF]' : i === 2 ? 'w-1/2 bg-[#00A3FF]' : 'w-0'}`} />
                      </div>
                    )}
                    {/* Right extending line after last step */}
                    {i === STEPS.length - 1 && (
                      <div className="relative w-8 sm:w-12 lg:w-16 h-0.5 mb-6 ml-0">
                        <div className="absolute inset-0 bg-[#00A3FF]" />
                        <div className="absolute left-0 top-0 h-full w-1/2 bg-[#00A3FF]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Success Icon */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">You are scheduled!</h2>
              
              <p className="text-xs sm:text-sm text-gray-600 max-w-md px-4">
                A calendar invitation has been sent to <span className="font-semibold">{userEmail}</span>
              </p>

              {/* Appointment Details Card */}
              <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mt-4">
                {selectedAgent && (
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${selectedAgent.color} overflow-hidden`}>
                      {!imageError ? (
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <Image 
                            src={selectedAgent.image}
                            alt={selectedAgent.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                            style={{ objectPosition: 'center top' }}
                            onError={() => {
                              setImageError(true);
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-sm sm:text-base">{selectedAgent.name.split(' ').map(n => n[0]).join('')}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900">{selectedAgent.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{selectedAgent.title}</p>
                      <p className="text-[10px] sm:text-xs text-gray-400">{selectedAgent.specialty}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase mb-2">Scheduled Date & Time</h4>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-3 items-center">
                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">{selectedDateInfo.dayName}, {selectedDateInfo.month} {selectedDateInfo.dayNum}, {selectedDateInfo.year}</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{scheduledTime}</span>
                      </div>
                    </div>
                  </div>

                  {jobInterests.length > 0 && (
                    <div>
                      <h4 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase mb-2">Job Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {jobInterests.map((interest) => (
                          <span key={interest} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {workPreferences.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase mb-2">Work Preferences</h4>
                      <div className="flex flex-wrap gap-2">
                        {workPreferences.map((pref) => (
                          <span key={pref} className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleDoneClick}
                className="w-full max-w-md bg-[#006BFF] text-white py-3 sm:py-4 rounded-lg border-none cursor-pointer text-sm sm:text-base font-bold shadow-lg transition-all hover:bg-[#0052CC] hover:shadow-xl mt-4 sm:mt-6"
              >
                Done
              </button>

              <p className="text-[10px] sm:text-xs text-gray-400 mt-4 px-4">
                Please check your email for the meeting link and calendar invite.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationComplete;