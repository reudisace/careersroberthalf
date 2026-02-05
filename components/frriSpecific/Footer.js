import React, { useState, useEffect, useRef } from "react";

const AnimatedNumber = ({ end, duration = 2000, color }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const startTime = Date.now();
          const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * end);
            
            setCount(current);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          animate();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return (
    <span ref={elementRef} style={{ color }}>
      {count}
    </span>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-[#e5e5e5] py-7 pt-12">
      <div className="max-w-[90%] lg:max-w-[62%] mx-auto px-4 lg:px-6 text-left text-[10px] lg:text-[12px] font-[regular] leading-relaxed space-y-4 lg:space-y-6">

        <p>
          Tesla participates in the <span className="underline !underline-offset-[3px]">E-Verify Program</span>.
        </p>

        <p>
          Tesla is an Equal Opportunity employer. All qualified applicants will receive consideration
          for employment without regard to any factor, including veteran status and disability status,
          protected by applicable federal, state or local laws.
        </p>

        <p>
          Tesla is also committed to working with and providing reasonable accommodations to individuals
          with disabilities. Let your recruiter know if you need an accommodation at any point during
          the interview process.
        </p>

        <p>
          For quick access to screen reading technology compatible with this site,&nbsp;
          <a href="#" className="!underline !underline-offset-[3px] text-white hover:text-white">
            download a free compatible screen reader
          </a>
          &nbsp;(
          <a href="#" className="!underline !underline-offset-[3px] text-white hover:text-white">
            view the free step-by-step tutorial
          </a>
          ). Contact&nbsp;
          <a href="mailto:ADA@tesla.com" className="!underline !underline-offset-[3px] text-white hover:text-white">
            ADA@tesla.com
          </a>
          &nbsp;for additional information or to request accommodations.
        </p>

        {/* Bottom links */}
        <div className="pt-6 lg:pt-10 flex flex-wrap justify-center gap-x-3 lg:gap-x-6 gap-y-2 text-[10px] lg:text-xs text-white">
          <a href="https://www.tesla.com/about" className="hover:underline text-white">Tesla © 2026</a>
          <a href="https://www.tesla.com/legal" className="hover:underline text-white">Privacy & Legal</a>
          <a href="https://service.tesla.com/en-US/vin-recall-search" className="hover:underline text-white">Vehicle Recalls</a>
          <a href="https://www.tesla.com/contact" className="hover:underline text-white">Contact</a>
          <a href="https://www.tesla.com/blog" className="hover:underline text-white">News</a>
          <a href="https://www.tesla.com/updates" className="hover:underline text-white">Get Updates</a>
          <a href="https://www.tesla.com/findus/list" className="hover:underline text-white">Locations</a>
          <a href="https://www.tesla.com/learn" className="hover:underline text-white">Learn</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
