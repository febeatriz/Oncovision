import { Button } from "@/components/ui/button";
import WelcomePopup from "@/components/WelcomePopup";
import { useState } from "react";

const Header = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleAboutClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div>
            <img src="/logo.png" alt="OncoVision" className="h-14 w-14" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">OncoVision</h1>
        </div>
        <button className="flex items-center gap-4" onClick={handleAboutClick}>
          About
        </button>
        {showPopup && <WelcomePopup onClose={handlePopupClose} />}
      </div>
    </header>
  );
};

export default Header;
