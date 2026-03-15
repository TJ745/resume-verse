// import Link from "next/link";

// const plans = [
//   {
//     id: "free",
//     name: "Free",
//     price: "$0",
//     period: "forever",
//     badge: null,
//     desc: "Everything you need to build and export a great resume.",
//     cta: "Get Started Free",
//     ctaHref: "/register",
//     ctaStyle: "outline" as const,
//     features: [
//       "1 resume",
//       "3 templates (Modern, Classic, Minimal)",
//       "Live preview & PDF export",
//       "All 4 builder steps",
//       "3 AI uses per month",
//     ],
//     unavailable: [
//       "Premium templates",
//       "Unlimited AI tools",
//       "DOCX export",
//       "Priority support",
//     ],
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     price: "$9",
//     period: "per month",
//     badge: "Most Popular",
//     desc: "Unlimited AI power for serious job seekers.",
//     cta: "Start 7-Day Free Trial",
//     ctaHref: "/register?plan=pro",
//     ctaStyle: "filled" as const,
//     features: [
//       "Unlimited resumes",
//       "All 10 templates + premium ones",
//       "PDF & DOCX export",
//       "Unlimited AI generations",
//       "ATS Simulator",
//       "JD Match & 1-click optimize",
//       "Cover Letter Generator",
//       "Grammar & Clarity Check",
//       "Achievement Generator",
//       "Career Gap Explainer",
//       "Interview Prep",
//       "Priority support",
//     ],
//     unavailable: [],
//   },
// ];

// export default function PricingSection() {
//   return (
//     <section
//       id="pricing"
//       style={{
//         padding: "7rem 4rem",
//         background: "var(--rv-paper)",
//         borderTop: "1px solid var(--rv-border)",
//       }}
//     >
//       <div style={{ maxWidth: 960, margin: "0 auto" }}>
//         {/* Heading */}
//         <div style={{ textAlign: "center", marginBottom: "4rem" }}>
//           <p
//             style={{
//               fontSize: "0.7rem",
//               fontWeight: 700,
//               letterSpacing: "0.14em",
//               textTransform: "uppercase",
//               color: "var(--rv-accent)",
//               marginBottom: "0.75rem",
//             }}
//           >
//             Pricing
//           </p>
//           <h2
//             className="font-serif"
//             style={{
//               fontSize: "clamp(2rem, 3.5vw, 3rem)",
//               color: "var(--rv-ink)",
//               lineHeight: 1.1,
//               marginBottom: "1rem",
//             }}
//           >
//             Simple, honest pricing.
//           </h2>
//           <p
//             style={{
//               fontSize: "1rem",
//               color: "var(--rv-muted)",
//               maxWidth: 480,
//               margin: "0 auto",
//               lineHeight: 1.65,
//             }}
//           >
//             Start free. Upgrade when you need the full toolkit. No hidden fees,
//             cancel anytime.
//           </p>
//         </div>

//         {/* Plan cards */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "1.5rem",
//             alignItems: "start",
//           }}
//         >
//           {plans.map((plan) => {
//             const isPro = plan.id === "pro";
//             return (
//               <div
//                 key={plan.id}
//                 style={{
//                   border: isPro
//                     ? "2px solid var(--rv-accent)"
//                     : "1px solid var(--rv-border)",
//                   borderRadius: 4,
//                   background: isPro ? "var(--rv-ink)" : "var(--rv-white)",
//                   padding: "2rem",
//                   position: "relative",
//                   overflow: "hidden",
//                 }}
//               >
//                 {/* Badge */}
//                 {plan.badge && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: 16,
//                       right: 16,
//                       fontSize: "0.6rem",
//                       fontWeight: 800,
//                       letterSpacing: "0.1em",
//                       textTransform: "uppercase",
//                       padding: "3px 10px",
//                       background: "var(--rv-accent)",
//                       color: "#fff",
//                       borderRadius: 99,
//                     }}
//                   >
//                     {plan.badge}
//                   </div>
//                 )}

//                 {/* Plan name */}
//                 <p
//                   style={{
//                     fontSize: "0.7rem",
//                     fontWeight: 700,
//                     letterSpacing: "0.1em",
//                     textTransform: "uppercase",
//                     color: isPro ? "rgba(255,255,255,0.5)" : "var(--rv-muted)",
//                     marginBottom: "0.5rem",
//                   }}
//                 >
//                   {plan.name}
//                 </p>

//                 {/* Price */}
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "baseline",
//                     gap: 4,
//                     marginBottom: "0.4rem",
//                   }}
//                 >
//                   <span
//                     className="font-serif"
//                     style={{
//                       fontSize: "3rem",
//                       fontWeight: 700,
//                       color: isPro ? "#fff" : "var(--rv-ink)",
//                       lineHeight: 1,
//                     }}
//                   >
//                     {plan.price}
//                   </span>
//                   <span
//                     style={{
//                       fontSize: "0.8rem",
//                       color: isPro
//                         ? "rgba(255,255,255,0.45)"
//                         : "var(--rv-muted)",
//                     }}
//                   >
//                     /{plan.period}
//                   </span>
//                 </div>

//                 {/* Desc */}
//                 <p
//                   style={{
//                     fontSize: "0.82rem",
//                     color: isPro ? "rgba(255,255,255,0.65)" : "var(--rv-muted)",
//                     lineHeight: 1.55,
//                     marginBottom: "1.75rem",
//                   }}
//                 >
//                   {plan.desc}
//                 </p>

//                 {/* CTA */}
//                 <Link
//                   href={plan.ctaHref}
//                   style={{
//                     display: "block",
//                     textAlign: "center",
//                     padding: "0.65rem 1rem",
//                     borderRadius: 2,
//                     fontWeight: 700,
//                     fontSize: "0.85rem",
//                     textDecoration: "none",
//                     marginBottom: "1.75rem",
//                     ...(plan.ctaStyle === "filled"
//                       ? {
//                           background: "var(--rv-accent)",
//                           color: "#fff",
//                           border: "2px solid var(--rv-accent)",
//                         }
//                       : {
//                           background: "transparent",
//                           color: "var(--rv-ink)",
//                           border: "2px solid var(--rv-border)",
//                         }),
//                   }}
//                 >
//                   {plan.cta}
//                 </Link>

//                 {/* Divider */}
//                 <div
//                   style={{
//                     borderTop: `1px solid ${isPro ? "rgba(255,255,255,0.1)" : "var(--rv-border)"}`,
//                     marginBottom: "1.25rem",
//                   }}
//                 />

//                 {/* Features */}
//                 <ul
//                   style={{
//                     listStyle: "none",
//                     padding: 0,
//                     margin: 0,
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 9,
//                   }}
//                 >
//                   {plan.features.map((f, i) => (
//                     <li
//                       key={i}
//                       style={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: 8,
//                         fontSize: "0.8rem",
//                         color: isPro
//                           ? "rgba(255,255,255,0.8)"
//                           : "var(--rv-ink)",
//                       }}
//                     >
//                       <CheckIcon pro={isPro} />
//                       {f}
//                     </li>
//                   ))}
//                   {plan.unavailable.map((f, i) => (
//                     <li
//                       key={`x-${i}`}
//                       style={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: 8,
//                         fontSize: "0.8rem",
//                         color: "var(--rv-muted)",
//                         opacity: 0.5,
//                       }}
//                     >
//                       <XIcon />
//                       {f}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             );
//           })}
//         </div>

//         {/* Footer note */}
//         <p
//           style={{
//             textAlign: "center",
//             fontSize: "0.75rem",
//             color: "var(--rv-muted)",
//             marginTop: "2rem",
//             lineHeight: 1.6,
//           }}
//         >
//           All plans include secure cloud storage. Pro billed monthly — cancel
//           anytime. No credit card required for Free.
//         </p>
//       </div>
//     </section>
//   );
// }

// function CheckIcon({ pro }: { pro: boolean }) {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: 14,
//         height: 14,
//         fill: "none",
//         stroke: pro ? "var(--rv-accent)" : "var(--rv-accent)",
//         strokeWidth: 2,
//         flexShrink: 0,
//         marginTop: 1,
//       }}
//     >
//       <path d="M2.5 8l4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }
// function XIcon() {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: 14,
//         height: 14,
//         fill: "none",
//         stroke: "var(--rv-muted)",
//         strokeWidth: 1.5,
//         flexShrink: 0,
//         marginTop: 1,
//       }}
//     >
//       <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
//     </svg>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    badge: null,
    desc: "Everything you need to build and export a great resume.",
    cta: "Get Started Free",
    ctaHref: "/register",
    ctaStyle: "outline" as const,
    features: [
      "1 resume",
      "3 templates (Modern, Classic, Minimal)",
      "Live preview & PDF export",
      "All 4 builder steps",
      "3 AI uses per month",
    ],
    unavailable: [
      "Premium templates",
      "Unlimited AI tools",
      "DOCX export",
      "Priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    period: "per month",
    badge: "Most Popular",
    desc: "Unlimited AI power for serious job seekers.",
    cta: "Start 7-Day Free Trial",
    ctaHref: "/register?plan=pro",
    ctaStyle: "filled" as const,
    features: [
      "Unlimited resumes",
      "All 10 templates + premium ones",
      "PDF & DOCX export",
      "Unlimited AI generations",
      "ATS Simulator",
      "JD Match & 1-click optimize",
      "Cover Letter Generator",
      "Grammar & Clarity Check",
      "Achievement Generator",
      "Career Gap Explainer",
      "Interview Prep",
      "Priority support",
    ],
    unavailable: [],
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      style={{
        padding: "7rem 4rem",
        background: "var(--rv-paper)",
        borderTop: "1px solid var(--rv-border)",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--rv-accent)",
              marginBottom: "0.75rem",
            }}
          >
            Pricing
          </p>
          <h2
            className="font-serif"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              color: "var(--rv-ink)",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            Simple, honest pricing.
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--rv-muted)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Start free. Upgrade when you need the full toolkit. No hidden fees,
            cancel anytime.
          </p>
        </div>

        {/* Plan cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {plans.map((plan) => {
            const isPro = plan.id === "pro";
            return (
              <div
                key={plan.id}
                style={{
                  border: isPro
                    ? "2px solid var(--rv-accent)"
                    : "1px solid var(--rv-border)",
                  borderRadius: 4,
                  background: isPro ? "var(--rv-ink)" : "var(--rv-white)",
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      background: "var(--rv-accent)",
                      color: "#fff",
                      borderRadius: 99,
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan name */}
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isPro ? "rgba(255,255,255,0.5)" : "var(--rv-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {plan.name}
                </p>

                {/* Price */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                    marginBottom: "0.4rem",
                  }}
                >
                  <span
                    className="font-serif"
                    style={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      color: isPro ? "#fff" : "var(--rv-ink)",
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: isPro
                        ? "rgba(255,255,255,0.45)"
                        : "var(--rv-muted)",
                    }}
                  >
                    /{plan.period}
                  </span>
                </div>

                {/* Desc */}
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: isPro ? "rgba(255,255,255,0.65)" : "var(--rv-muted)",
                    lineHeight: 1.55,
                    marginBottom: "1.75rem",
                  }}
                >
                  {plan.desc}
                </p>

                {/* CTA */}
                {isPro ? (
                  <ProCTAButton label={plan.cta} />
                ) : (
                  <Link
                    href={plan.ctaHref}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "0.65rem 1rem",
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      marginBottom: "1.75rem",
                      background: "transparent",
                      color: "var(--rv-ink)",
                      border: "2px solid var(--rv-border)",
                    }}
                  >
                    {plan.cta}
                  </Link>
                )}

                {/* Divider */}
                <div
                  style={{
                    borderTop: `1px solid ${isPro ? "rgba(255,255,255,0.1)" : "var(--rv-border)"}`,
                    marginBottom: "1.25rem",
                  }}
                />

                {/* Features */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                  }}
                >
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: "0.8rem",
                        color: isPro
                          ? "rgba(255,255,255,0.8)"
                          : "var(--rv-ink)",
                      }}
                    >
                      <CheckIcon pro={isPro} />
                      {f}
                    </li>
                  ))}
                  {plan.unavailable.map((f, i) => (
                    <li
                      key={`x-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: "0.8rem",
                        color: "var(--rv-muted)",
                        opacity: 0.5,
                      }}
                    >
                      <XIcon />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "var(--rv-muted)",
            marginTop: "2rem",
            lineHeight: 1.6,
          }}
        >
          All plans include secure cloud storage. Pro billed monthly — cancel
          anytime. No credit card required for Free.
        </p>
      </div>
    </section>
  );
}

function CheckIcon({ pro }: { pro: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 14,
        height: 14,
        fill: "none",
        stroke: pro ? "var(--rv-accent)" : "var(--rv-accent)",
        strokeWidth: 2,
        flexShrink: 0,
        marginTop: 1,
      }}
    >
      <path d="M2.5 8l4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 14,
        height: 14,
        fill: "none",
        stroke: "var(--rv-muted)",
        strokeWidth: 1.5,
        flexShrink: 0,
        marginTop: 1,
      }}
    >
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function ProCTAButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        // Not logged in — send to register
        window.location.href = "/register?plan=pro";
      } else {
        setLoading(false);
      }
    } catch {
      window.location.href = "/register?plan=pro";
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: "block",
        width: "100%",
        textAlign: "center",
        padding: "0.65rem 1rem",
        marginBottom: "1.75rem",
        borderRadius: 2,
        fontWeight: 700,
        fontSize: "0.85rem",
        background: loading ? "rgba(200,75,47,0.7)" : "var(--rv-accent)",
        color: "#fff",
        border: "2px solid var(--rv-accent)",
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
      }}
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}
