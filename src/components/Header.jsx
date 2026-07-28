import React, { useState } from "react";
import logo from "/logo.png";

const navItem = [
  {
    title: "About Us",
    url: "/about",
    children: [
      { title: "Company Overview", url: "/about/company" },
      { title: "Our Mission & Vision", url: "/about/mission" },
      { title: "Our Global Presence", url: "/about/global-presence" },
    ],
  },
  {
    title: "Services",
    url: "/services",
    children: [
      { title: "Workforce Sourcing", url: "/services/workforce-sourcing" },
      { title: "Overseas Recruitment", url: "/services/overseas-recruitment" },
      { title: "Executive Search", url: "/services/executive-search" },
      { title: "Bulk Hiring", url: "/services/bulk-hiring" },
      { title: "Permanent Staffing", url: "/services/permanent-staffing" },
      { title: "Temporary Staffing", url: "/services/temporary-staffing" },
      { title: "Recruitment Process Outsourcing (RPO)", url: "/services/rpo" },
      { title: "Candidate Screening", url: "/services/candidate-screening" },
      { title: "Trade Testing & Assessment", url: "/services/trade-testing" },
      { title: "Payroll & HR Solutions", url: "/services/payroll-hr" },
      { title: "Visa & Documentation Support", url: "/services/visa-support" },
      { title: "Relocation & Onboarding", url: "/services/relocation" },
    ],
  },
  {
    title: "Employers",
    url: "/employers",
    children: [
      { title: "Hire Talent", url: "/employers/hire-talent" },
      { title: "Employer Solutions", url: "/employers/solutions" },
      { title: "Recruitment Process", url: "/employers/process" },
      { title: "Request Employees", url: "/employers/request-employees" },
      { title: "Why Choose Us", url: "/employers/why-us" },
    ],
  },
  {
    title: "Candidates",
    url: "/candidates",
    children: [
      { title: "Live Jobs", url: "/jobs" },
      { title: "Upload CV", url: "/upload-cv" },
      { title: "Candidate Registration", url: "/register" },
      { title: "Career Advice", url: "/career-advice" },
      { title: "Interview Preparation", url: "/interview-preparation" },
      { title: "Visa Guidance", url: "/visa-guidance" },
      { title: "Relocation Support", url: "/relocation-support" },
    ],
  },
  {
    title: "Countries",
    url: "/countries",
    children: [
      { title: "Croatia", url: "/countries/croatia" },
      { title: "Poland", url: "/countries/poland" },
      { title: "Romania", url: "/countries/romania" },
      { title: "Slovenia", url: "/countries/slovenia" },
      { title: "Latvia", url: "/countries/latvia" },
      { title: "Serbia", url: "/countries/serbia" },
    ],
  },
  {
    title: "Success Stories",
    url: "/success-stories",
    children: [
      { title: "Client Testimonials", url: "/success-stories/clients" },
      { title: "Candidate Success", url: "/success-stories/candidates" },
      { title: "Case Studies", url: "/success-stories/case-studies" },
    ],
  },
  {
    title: "Resources",
    url: "/resources",
    children: [
      { title: "Blog", url: "/blog" },
      { title: "News", url: "/news" },
      { title: "Recruitment Insights", url: "/resources/insights" },
      { title: "FAQs", url: "/faqs" },
    ],
  },
];

const Header = () => {
  const [openMobile, setOpenMobile] = useState(false);
  const [openSub, setOpenSub] = useState(null);

  return (
    <header className="font-arimo fixed left-0 top-0 z-50 w-full border-b border-ink/5 bg-primary-bg/95 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex shrink-0 items-center">
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
        </a>

        <nav className="hidden items-center lg:flex">
          {navItem.map((item, index) => {
            const wide = item.children.length > 6;
            return (
              <div key={index} className="group relative">
                <a
                  href={item.url}
                  className="relative flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium text-ink transition-colors duration-300 hover:text-brand-indigo"
                >
                  {item.title}
                  {item.children.length > 0 && (
                    <svg
                      viewBox="0 0 10 6"
                      className="mt-px h-2 w-2.5 fill-none stroke-ink-light stroke-[1.5] transition-transform duration-300 group-hover:rotate-180 group-hover:stroke-brand-indigo"
                    >
                      <path
                        d="M1 1l4 4 4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-brand-indigo transition-all duration-500 ease-out group-hover:w-[60%]" />
                </a>

                {item.children.length > 0 && (
                  <div
                    className={`invisible absolute left-1/2 top-full mt-5 -translate-x-1/2 translate-y-3 rounded-[28px] bg-primary-bg p-3 opacity-0 shadow-dropdown ring-1 ring-ink/5 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
                      wide ? "w-[560px]" : "w-72"
                    }`}
                  >
                    <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-ink/5 bg-primary-bg" />

                    <p className="relative z-10 px-4 pb-2 pt-1 text-[11px] font-semibold tracking-[0.08em] text-ink-light">
                      {item.title.toUpperCase()}
                    </p>

                    <div
                      className={`relative z-10 grid gap-1 ${wide ? "grid-cols-2" : "grid-cols-1"}`}
                    >
                      {item.children.map((sub, subIndex) => (
                        <a
                          key={subIndex}
                          href={sub.url}
                          className="group/item flex items-center justify-between gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-ink-light transition-colors duration-200 hover:bg-brand-indigo/[0.06] hover:text-brand-indigo"
                        >
                          <span>{sub.title}</span>
                          <span className="shrink-0 -translate-x-1 text-brand-indigo opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100">
                            →
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:flex">
          <a
            href="/contact"
            className="group relative overflow-hidden rounded-tl-2xl rounded-br-2xl p-[1.5px] transition-transform duration-500 hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 rounded-tl-2xl rounded-br-2xl bg-[linear-gradient(120deg,#2632E0,#01C2FB,#50A153,#F8AF3C,#D50042)]" />
            <span className="relative flex items-center gap-2 overflow-hidden rounded-tl-2xl rounded-br-2xl bg-primary-bg px-6 py-2.5 text-sm font-semibold text-ink transition-colors duration-500 group-hover:bg-transparent group-hover:text-white">
              <span className="absolute inset-0 translate-x-[-120%] bg-white/25 blur-md transition-all duration-700 ease-out group-hover:translate-x-[120%]" />
              <span className="relative z-10">Contact Us</span>
              <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </span>
          </a>
        </div>

        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 bg-white lg:hidden"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-ink transition-all duration-300 ${openMobile ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-ink transition-all duration-300 ${openMobile ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-ink transition-all duration-300 ${openMobile ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-ink/5 bg-primary-bg transition-all duration-500 lg:hidden ${
          openMobile
            ? "max-h-[80vh] overflow-y-auto opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-4 py-5">
          <a
            href="/"
            className="block rounded-2xl px-4 py-3 text-[15px] font-semibold text-ink transition-colors duration-300 hover:bg-brand-indigo/[0.06] hover:text-brand-indigo"
          >
            Home
          </a>

          {navItem.map((item, index) => (
            <div key={index}>
              {item.children.length > 0 ? (
                <>
                  <button
                    onClick={() => setOpenSub(openSub === index ? null : index)}
                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-[15px] font-semibold text-ink transition-colors duration-300 hover:bg-brand-indigo/[0.06]"
                  >
                    {item.title}
                    <svg
                      viewBox="0 0 10 6"
                      className={`h-2.5 w-3 fill-none stroke-ink-light stroke-[1.5] transition-transform duration-300 ${openSub === index ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M1 1l4 4 4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${openSub === index ? "max-h-[500px]" : "max-h-0"}`}
                  >
                    <div className="mt-1 grid grid-cols-1 gap-1 rounded-3xl bg-white p-2 shadow-sm sm:grid-cols-2">
                      {item.children.map((sub, subIndex) => (
                        <a
                          key={subIndex}
                          href={sub.url}
                          className="block rounded-2xl px-4 py-3 text-sm font-medium text-ink-light transition-colors duration-300 hover:bg-brand-indigo/[0.06] hover:text-brand-indigo"
                        >
                          {sub.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <a
                  href={item.url}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-semibold text-ink transition-colors duration-300 hover:bg-brand-indigo/[0.06]"
                >
                  {item.title}
                </a>
              )}
            </div>
          ))}

          <a
            href="/contact"
            className="group relative mt-4 block overflow-hidden rounded-full p-[1.5px]"
          >
            <span className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB,#50A153,#F8AF3C,#D50042)]" />
            <span className="relative block rounded-full bg-primary-bg px-7 py-3 text-center text-sm font-semibold text-ink transition-colors duration-500 group-active:bg-transparent group-active:text-white">
              Contact Us
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
