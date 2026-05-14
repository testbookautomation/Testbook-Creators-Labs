import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions — Testbook Creators Lab",
};

const sections = [
  {
    num: "1",
    title: "Overview",
    content: (
      <>
        <p>These Terms &amp; Conditions govern your participation in the Testbook Creators Lab campaign, operated by Testbook.com. By submitting a video through the Creators Lab portal, you agree to be bound by these terms in their entirety.</p>
        <p className="mt-3">Testbook Creators Lab is a student creator campaign that allows registered Testbook users to create short video content about their exam preparation experience with Testbook Pass and earn payouts based on campaign guidelines.</p>
      </>
    ),
  },
  {
    num: "2",
    title: "Eligibility",
    content: (
      <ul className="list-none space-y-2">
        <li><span className="font-semibold text-slate-700">a)</span> You must be a registered user on Testbook.com with an active account.</li>
        <li><span className="font-semibold text-slate-700">b)</span> You must have a valid phone number linked to your Testbook account.</li>
        <li><span className="font-semibold text-slate-700">c)</span> Testbook employees, contractors, and their immediate family members are not eligible to participate.</li>
      </ul>
    ),
  },
  {
    num: "3",
    title: "Campaign Participation",
    content: (
      <ul className="list-none space-y-2">
        <li><span className="font-semibold text-slate-700">a)</span> Each participant is allowed to submit one (1) video per campaign cycle. Duplicate or multiple submissions within the same campaign will be rejected.</li>
        <li><span className="font-semibold text-slate-700">b)</span> To participate, log in to the Creators Lab portal using your Testbook account, record your video as per the guidelines provided, and upload it by tapping the Submit Video option on the portal homepage.</li>
        <li><span className="font-semibold text-slate-700">c)</span> All videos must be uploaded directly through the Creators Lab portal. Videos shared via email, social media links, or any other channel will not be considered as valid submissions.</li>
        <li><span className="font-semibold text-slate-700">d)</span> Testbook reserves the right to modify, pause, or discontinue any campaign at any time without prior notice.</li>
      </ul>
    ),
  },
  {
    num: "4",
    title: "Review & Approval",
    content: (
      <ul className="list-none space-y-2">
        <li><span className="font-semibold text-slate-700">a)</span> All submitted videos are subject to review by the Testbook campaign team. Testbook reserves sole discretion to approve or reject any submission.</li>
        <li><span className="font-semibold text-slate-700">b)</span> The review process is handled as timely as possible after submission, though timelines may vary by campaign volume.</li>
        <li><span className="font-semibold text-slate-700">c)</span> If a video is rejected, the creator will be notified with the reason for rejection where possible. Testbook is not obligated to provide detailed feedback on every rejection.</li>
        <li><span className="font-semibold text-slate-700">d)</span> Testbook may request minor modifications to a submitted video before granting approval. The creator may choose to make the requested changes and resubmit, or withdraw the submission.</li>
      </ul>
    ),
  },
  {
    num: "5",
    title: "Ownership & Intellectual Property",
    content: (
      <ul className="list-none space-y-2">
        <li><span className="font-semibold text-slate-700">a)</span> By submitting a video through the Creators Lab portal, you irrevocably transfer and assign all rights, title, and interest in the video to Testbook.com, including but not limited to all intellectual property rights, copyright, distribution rights, and the right to create derivative works.</li>
        <li><span className="font-semibold text-slate-700">b)</span> Testbook shall have the unrestricted right to use, reproduce, edit, crop, subtitle, adapt, publish, distribute, and display the video across all media and platforms, including but not limited to the Testbook website, mobile application, social media channels, paid advertising campaigns, email marketing, and third-party promotional partnerships.</li>
        <li><span className="font-semibold text-slate-700">c)</span> Testbook may use your name, likeness, voice, and any personal information visible or audible in the video for promotional and marketing purposes in connection with the campaign.</li>
        <li><span className="font-semibold text-slate-700">d)</span> You waive any right to inspect or approve the final form of the content as used by Testbook, and you waive any claims related to moral rights to the extent permitted by applicable law.</li>
        <li><span className="font-semibold text-slate-700">e)</span> You represent and warrant that the submitted video is your original creation, that you have full authority to transfer ownership, and that the video does not infringe upon the intellectual property rights, privacy rights, or any other rights of any third party.</li>
      </ul>
    ),
  },
  {
    num: "6",
    title: "Payouts",
    content: (
      <ul className="list-none space-y-2">
        <li><span className="font-semibold text-slate-700">a)</span> Payout eligibility is determined solely by Testbook based on the campaign criteria in effect at the time of submission.</li>
        <li><span className="font-semibold text-slate-700">b)</span> Eligible payouts will be processed within 5 to 7 working days from the date the video is confirmed as eligible.</li>
        <li><span className="font-semibold text-slate-700">c)</span> All payouts will be made directly to the UPI ID linked to your Testbook account. It is your responsibility to ensure that your UPI details are accurate and up to date in the Testbook app before your video becomes eligible for payout.</li>
        <li><span className="font-semibold text-slate-700">d)</span> Testbook is not responsible for failed, delayed, or misdirected payments resulting from incorrect or outdated UPI information provided by the creator.</li>
        <li><span className="font-semibold text-slate-700">e)</span> Payout amounts are determined by Testbook at its sole discretion based on the applicable campaign tier and guidelines. Payout amounts mentioned on the Creators Lab portal or campaign materials are indicative and do not constitute a guarantee.</li>
      </ul>
    ),
  },
  {
    num: "7",
    title: "Prohibited Conduct",
    content: (
      <>
        <p className="mb-3">The following actions are strictly prohibited and may result in immediate disqualification, forfeiture of payout, and permanent ban from future campaigns:</p>
        <ul className="list-none space-y-2">
          <li><span className="font-semibold text-slate-700">a)</span> Submitting a video that is not your original work or that infringes on any third-party rights.</li>
          <li><span className="font-semibold text-slate-700">b)</span> Submitting false, misleading, or fabricated information in your video or account details.</li>
          <li><span className="font-semibold text-slate-700">c)</span> Attempting to manipulate view counts, engagement metrics, or any campaign performance data through artificial or fraudulent means.</li>
          <li><span className="font-semibold text-slate-700">d)</span> Using automated tools, bots, or scripts to interact with the Creators Lab portal.</li>
          <li><span className="font-semibold text-slate-700">e)</span> Engaging in any behaviour that is abusive, threatening, or harmful to other participants, Testbook staff, or the campaign community.</li>
          <li><span className="font-semibold text-slate-700">f)</span> Deleting or making the submitted video inaccessible after submission and before the review and payout process is complete.</li>
        </ul>
      </>
    ),
  },
  {
    num: "8",
    title: "Privacy & Data",
    content: (
      <ul className="list-none space-y-2">
        <li><span className="font-semibold text-slate-700">a)</span> By participating in the campaign, you consent to Testbook collecting, storing, and processing your personal information including your name, phone number, email address, UPI details, and video content for the purposes of campaign administration, review, payout processing, and promotional use.</li>
        <li><span className="font-semibold text-slate-700">b)</span> Your data will be handled in accordance with the Testbook Privacy Policy available at{" "}<a href="https://testbook.com/privacy" target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">testbook.com/privacy</a>.</li>
      </ul>
    ),
  },
  {
    num: "9",
    title: "Disclaimers",
    content: (
      <ul className="list-none space-y-2">
        <li><span className="font-semibold text-slate-700">a)</span> Testbook makes no guarantee regarding the number of views, reach, or performance of any submitted video.</li>
        <li><span className="font-semibold text-slate-700">b)</span> Testbook is not responsible for any technical issues, portal downtime, upload failures, or any other circumstances beyond its reasonable control that may affect your ability to participate in or benefit from the campaign.</li>
        <li><span className="font-semibold text-slate-700">c)</span> Testbook reserves the right to remove any published video at any time and for any reason without prior notice to the creator.</li>
      </ul>
    ),
  },
  {
    num: "10",
    title: "Modifications to These Terms",
    content: (
      <p>Testbook reserves the right to update, modify, or replace these Terms &amp; Conditions at any time. Any changes will be posted on the Creators Lab portal. Your continued participation in the campaign after any such changes constitutes your acceptance of the revised terms. It is your responsibility to review these terms periodically.</p>
    ),
  },
  {
    num: "11",
    title: "Termination & Disqualification",
    content: (
      <ul className="list-none space-y-2">
        <li><span className="font-semibold text-slate-700">a)</span> Testbook may terminate your participation in the campaign at any time and for any reason, including but not limited to violation of these terms or suspected fraudulent activity.</li>
        <li><span className="font-semibold text-slate-700">b)</span> Upon termination, you forfeit any pending or unpaid payouts unless Testbook determines otherwise at its sole discretion.</li>
        <li><span className="font-semibold text-slate-700">c)</span> Testbook&apos;s rights under Section 5 (Ownership &amp; Intellectual Property) shall survive termination.</li>
      </ul>
    ),
  },
  {
    num: "12",
    title: "Governing Law & Dispute Resolution",
    content: (
      <ul className="list-none space-y-2">
        <li><span className="font-semibold text-slate-700">a)</span> These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India.</li>
        <li><span className="font-semibold text-slate-700">b)</span> Any disputes arising out of or in connection with these terms or the campaign shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.</li>
        <li><span className="font-semibold text-slate-700">c)</span> Before initiating any formal legal proceedings, both parties agree to attempt to resolve disputes through good-faith negotiation for a period of not less than 30 days.</li>
      </ul>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <section className="tb-gradient text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-black">Terms &amp; Conditions</h1>
          <p className="text-blue-100 text-sm mt-1">Testbook Student Creator Campaign &nbsp;·&nbsp; Last updated: May 2026</p>
        </div>
      </section>

      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-4">

          {sections.map(({ num, title, content }) => (
            <div key={num} className="card p-6">
              <h2 className="font-black text-slate-900 text-base mb-3 flex items-start gap-2">
                <span className="w-6 h-6 tb-gradient rounded-md flex items-center justify-center text-white text-[11px] font-black shrink-0 mt-0.5">{num}</span>
                {title}
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed">
                {content}
              </div>
            </div>
          ))}

          <div className="card p-5 text-center text-sm text-slate-500 space-y-1">
            <p className="font-black text-slate-800">Testbook Creators Lab</p>
            <p>
              <a href="mailto:creator-support@testbook.com" className="text-blue-700 hover:underline">creator-support@testbook.com</a>
              {" · "}
              <a href="https://ugc.testbook.com" target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">ugc.testbook.com</a>
            </p>
            <p className="text-slate-400 text-xs">&copy; 2026 Testbook.com. All rights reserved.</p>
          </div>

          <div className="text-center pb-4">
            <Link href="/submit" className="btn-primary text-sm px-6 py-2.5 min-h-0 inline-flex">
              Back to Submit
            </Link>
          </div>

        </div>
      </main>

      <Footer />
      <div className="h-16 md:hidden"/>
    </div>
  );
}
