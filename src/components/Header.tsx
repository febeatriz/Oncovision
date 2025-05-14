import { Button } from "@/components/ui/button";
import AboutDialog from "@/components/AboutDialog";
import { useAuth } from "@/lib/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleAboutClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center -ml-20 gap-2">
          <div>
            <img src="/logo.png" alt="OncoVision" className="h-14 w-14" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">OncoVision</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Olá, {user?.name}
          </span>
          <Button
            variant="ghost"
            onClick={handleAboutClick}
          >
            Sobre
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
        <AboutDialog open={showPopup} onClose={handlePopupClose} />
      </div>
    </header>
  );
};

export default Header;
