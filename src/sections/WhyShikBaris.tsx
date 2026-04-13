import React from 'react';
import svgPaths from "./svg-gr1fih5njt";

export default function WhyTriptoSection() {
  return (
    <div className="flex flex-col gap-[32px] items-center justify-center relative w-full py-10" data-name="WhyTripto Section">
      {/* Main Header */}
      <div className="flex flex-col font-semibold justify-center leading-[46px] relative text-[#121316] text-[32px] md:text-[36px] text-center px-4" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p>Why Travellers Trust ShikBaris</p>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[1232px] flex flex-col items-center">
        
        {/* Background Decorative Lines - Hidden on Mobile, exact same paths for Desktop */}
        <div className="hidden md:flex flex-row gap-[150px] h-[224px] items-start justify-center w-full px-[201px] absolute top-0 left-0 pointer-events-none" data-name="Decorative Lines">
          <div className="h-[83.264px] relative shrink-0 w-[339.805px]">
            <div className="absolute inset-[-0.6%_-0.78%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 345.139 84.2642">
                <path d={svgPaths.p1f294e70} fill="var(--stroke-0, #669CFF)" id="Vector 5" />
              </svg>
            </div>
          </div>
          <div className="h-[83.264px] relative shrink-0 w-[339.805px]">
            <div className="absolute inset-[-0.6%_-0.78%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 345.139 84.2642">
                <path d={svgPaths.p1f294e70} fill="var(--stroke-0, #669CFF)" id="Vector 5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Grid - Stacks on mobile, exact spacing on desktop */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between w-full gap-[48px] md:gap-0 px-6 md:px-0">
          
          {/* Feature 1: No hidden fees */}
          <div className="flex flex-col gap-[32px] items-center shrink-0 w-full md:w-[264px]">
            <div className="bg-[#e8effc] flex items-center justify-center p-[8px] rounded-[24px] size-[100px]">
              <svg className="block size-[56px]" fill="none" viewBox="0 0 56 56">
                <path d={svgPaths.p363d7c00} fill="#0066CC" />
              </svg>
            </div>
            <div className="flex flex-col gap-[12px] items-center text-[#383e48] text-center">
              <p className="font-semibold text-[24px] leading-[32px]">No hidden fees</p>
              <p className="font-normal text-[16px] leading-[24px]">Transparent pricing with no hidden fees.</p>
            </div>
          </div>

          {/* Feature 2: Instant booking */}
          <div className="flex flex-col gap-[32px] items-center shrink-0 w-full md:w-[264px]">
            <div className="bg-[#e8effc] flex items-center justify-center p-[8px] rounded-[24px] size-[100px]">
              <svg className="block size-[56px]" fill="none" viewBox="0 0 56 56">
                <path d={svgPaths.p28287100} fill="#0066CC" />
              </svg>
            </div>
            <div className="flex flex-col gap-[12px] items-center text-[#383e48] text-center">
              <p className="font-semibold text-[24px] leading-[32px]">Instant booking</p>
              <p className="font-normal text-[16px] leading-[24px]">Get confirmation right after you reserve.</p>
            </div>
          </div>

          {/* Feature 3: Flexibility */}
          <div className="flex flex-col gap-[32px] items-center shrink-0 w-full md:w-[264px]">
            <div className="bg-[#e8effc] flex items-center justify-center p-[8px] rounded-[24px] size-[100px]">
              <svg className="block size-[56px]" fill="none" viewBox="0 0 56 56">
                <path d={svgPaths.p3e8efd00} fill="#0066CC" />
              </svg>
            </div>
            <div className="flex flex-col gap-[12px] items-center text-[#383e48] text-center">
              <p className="font-semibold text-[24px] leading-[32px]">Flexibility</p>
              <p className="font-normal text-[16px] leading-[24px]">Flexible options with free cancellation on many listings.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}