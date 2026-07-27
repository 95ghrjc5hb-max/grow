import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="p-8 max-w-4xl mx-auto text-slate-300">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">Last Updated: July 2026 | GROW Next-Gen SaaS</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed bg-[#0d111a] p-8 rounded-2xl border border-white/10 shadow-xl">
        <p>
          At <strong>GROW Next-Gen SaaS</strong>, safeguarding your digital privacy and securing your business data is our highest priority. This Privacy Policy outlines our data governance practices, specifically concerning integrations with third-party platforms such as Meta and Shopify.
        </p>

        <h2 className="text-lg font-semibold text-white mt-6">1. Information We Collect</h2>
        <p>To provide our advanced automation services, we securely collect:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-400">
          <li><strong>Account Information:</strong> Name, email address, and authentication credentials.</li>
          <li><strong>Integration Data:</strong> Secure OAuth tokens required to connect and synchronize with Meta (Facebook/Instagram) and Shopify APIs.</li>
        </ul>

        <h2 className="text-lg font-semibold text-white mt-6">2. How We Use Your Data</h2>
        <p>Your data is processed strictly for the operational functionality of the GROW platform, including:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-400">
          <li>Facilitating AI-driven automated responses across connected channels.</li>
          <li>Generating real-time business analytics and unified inbox synchronization.</li>
          <li>Ensuring platform security and preventing unauthorized access.</li>
        </ul>

        <h2 className="text-lg font-semibold text-white mt-6">3. Data Security & Storage</h2>
        <p>
          We employ enterprise-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit. We do not sell, rent, or share your proprietary business data or integration tokens with any unauthorized third parties.
        </p>

        <h2 className="text-lg font-semibold text-white mt-6">4. User Data Deletion</h2>
        <p>
          You retain complete control over your data. If you wish to revoke access, disconnect your Meta/Shopify accounts, or request complete deletion of your data from our servers, you can do so at any time by emailing our compliance team at{" "}
          <a href="mailto:supportgrowapp@gmail.com" className="text-teal-400 hover:text-cyan-300 underline transition-colors">
            supportgrowapp@gmail.com
          </a>. We will process your request and permanently erase your data and tokens within 7 business days.
        </p>

        <h2 className="text-lg font-semibold text-white mt-6">5. Contact Our Support</h2>
        <p>
          For any privacy-related inquiries or technical support, please contact us at:{" "}
          <a href="mailto:supportgrowapp@gmail.com" className="text-teal-400 hover:text-cyan-300 underline transition-colors">
            supportgrowapp@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
