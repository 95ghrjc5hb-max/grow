import React from "react";

export default function Terms() {
  return (
    <div className="p-8 max-w-4xl mx-auto text-slate-300">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500">Last Updated: July 2026 | GROW Next-Gen SaaS</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed bg-[#0d111a] p-8 rounded-2xl border border-white/10 shadow-xl">
        <p>
          Welcome to <strong>GROW Next-Gen SaaS</strong>. By accessing our platform and utilizing our API integrations, you agree to be bound by these Terms of Service.
        </p>

        <h2 className="text-lg font-semibold text-white mt-6">1. Platform Usage & API Compliance</h2>
        <p>
          GROW operates by connecting to third-party APIs (including Meta and Shopify). By using our service, you must also strictly comply with the respective Terms of Service and Developer Policies of these platforms. You agree not to use GROW to transmit spam, malicious code, or any content that violates Meta's Community Standards.
        </p>

        <h2 className="text-lg font-semibold text-white mt-6">2. Account Security</h2>
        <p>
          You are solely responsible for maintaining the confidentiality of your account access and any authorized third-party integrations. Any unauthorized use of your account must be immediately reported to our security team.
        </p>

        <h2 className="text-lg font-semibold text-white mt-6">3. Service Availability & Modifications</h2>
        <p>
          As an advanced SaaS platform, we continuously update our systems with new AI models and features. We reserve the right to modify, suspend, or discontinue any feature to maintain system integrity and security without prior notice.
        </p>

        <h2 className="text-lg font-semibold text-white mt-6">4. Termination</h2>
        <p>
          We reserve the right to immediately suspend or terminate your access to GROW if we detect any breach of these Terms, API abuse, or activities that compromise the security of our infrastructure or third-party networks.
        </p>

        <h2 className="text-lg font-semibold text-white mt-6">5. Contact & Legal Support</h2>
        <p>
          For any legal inquiries or support regarding these terms, please reach out to us at:{" "}
          <a href="mailto:supportgrowapp@gmail.com" className="text-teal-400 hover:text-cyan-300 underline transition-colors">
            supportgrowapp@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
