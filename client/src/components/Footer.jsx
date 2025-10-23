import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-around gap-10">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-orange-400">GetTest AI</h2>
          <p className="mt-2 text-sm text-gray-400">
            Empowering learners through smart, AI-generated practice tests.
          </p>
        </div>

        {/* Social / Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
          <div className="flex gap-5 text-orange-400 text-xl">
            <a href="mailto:support@gettest.ai" className="hover:text-white transition"><FaEnvelope /></a>
            <a href="https://www.linkedin.com/in/bhupendra-dewangan-172-rahul" target="_blank" className="hover:text-white transition"><FaLinkedin /></a>
            <a href="https://github.com/Bhupendra-17/GetTest-AI" target="_blank" className="hover:text-white transition"><FaGithub /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 text-center text-sm py-4 bg-gray-900 text-gray-500">
        © {new Date().getFullYear()} GetTest AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;