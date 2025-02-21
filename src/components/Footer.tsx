
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">HealthMoniTree</h3>
            <p className="text-sm text-gray-600">
              Advanced healthcare monitoring powered by AI technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-2">
              <a
                href="mailto:support@healthmonitree.com"
                className="flex items-center gap-2 text-gray-600 hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                support@healthmonitree.com
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => window.open('/chat', '_blank')}
            >
              <MessageCircle className="h-4 w-4" />
              Chat with AI Assistant
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-gray-600">
          <p>© 2025 HealthMoniTree. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
