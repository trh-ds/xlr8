import { useNavigate } from "react-router-dom";
import { Instagram, Linkedin, Twitter, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Footer = () => {
  const navigate = useNavigate();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">XLR8 Aerospace</h3>
            {/* <p className="text-background/70">Premium shopping experience for the modern lifestyle.</p> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigation("/products")} 
                  className="text-background/70 hover:text-primary transition-colors cursor-pointer"
                >
                  Products
                </button>
              </li>
              {/* <li>
                <button 
                  onClick={() => handleNavigation("/about")} 
                  className="text-background/70 hover:text-primary transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li> */}
              <li>
                <button 
                  onClick={() => handleNavigation("/contact")} 
                  className="text-background/70 hover:text-primary transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="https://www.instagram.com/xlr8aerospace?igsh=MXdrajNjcWljZXFoZg=="
                className="text-background/70 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: -5 }}
                href="https://www.linkedin.com/company/xlr8-aerospace/posts/?feedView=all"
                className="text-background/70 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="https://x.com/XLR8aerospace"
                className="text-background/70 hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Newsletter */}
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/70 text-sm">
            © 2025 XLR8 Aerospace. All rights reserved. | Privacy Policy | Terms of Service
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToTop}
            className="text-background hover:text-primary hover:bg-background/10"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
