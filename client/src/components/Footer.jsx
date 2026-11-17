import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from '/logo.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block">
              <img src={Logo} alt="GetTest AI" className="h-10 w-auto rounded-xl" />
            </Link>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Empowering learners through smart, AI-generated practice tests from your study notes and exam syllabi.
            </p>
            <div className="flex gap-4 text-slate-400 text-lg mt-4">
              <a
                href="mailto:support@gettest.ai"
                className="hover:text-orange-500 transition p-2 rounded-lg hover:bg-orange-50"
                aria-label="Email support"
              >
                <FaEnvelope />
              </a>
              {/* <a
                href="https://www.linkedin.com/in/bhupendra-dewangan-172-rahul"
                target="_blank"
                rel="noreferrer"
                className="hover:text-orange-500 transition p-2 rounded-lg hover:bg-orange-50"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a> */}
              <a
                href="https://github.com/Bhupendra-17/GetTest-AI"
                target="_blank"
                rel="noreferrer"
                className="hover:text-orange-500 transition p-2 rounded-lg hover:bg-orange-50"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link to="/" className="hover:text-orange-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/main" className="hover:text-orange-600 transition">
                  Create Mock Test
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-orange-600 transition">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-600 transition">
                  About GetTest AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Examinations */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Exam Categories</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Bank PO & Clerk (IBPS/SBI)</li>
              <li>SSC CGL & CHSL</li>
              <li>Railway Recruitment RRB</li>
              <li>Quantitative & Reasoning Drills</li>
              <li>Custom PDF Ingestion</li>
            </ul>
          </div>

          {/* Technology & Trust */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">AI Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Powered by advanced LLM concept extraction and psychometric difficulty balancing for realistic exam simulations.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Fast Inference Active
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} GetTest AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-slate-600 transition">
              About
            </Link>
            <Link to="/pricing" className="hover:text-slate-600 transition">
              Subscriptions
            </Link>
            <a href="https://github.com/Bhupendra-17/GetTest-AI" target="_blank" rel="noreferrer" className="hover:text-slate-600 transition">
              Open Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
