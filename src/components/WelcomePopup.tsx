import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface WelcomePopupProps {
  onClose: () => void;
}

const WelcomePopup = ({ onClose }: WelcomePopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup when component mounts
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl min-h-[400px] max-h-[800px] flex flex-col items-center justify-center p-6">
        <div className="flex items-center justify-center gap-4">
          <img
            src="/oncovision-mascot.png"
            alt="OncoVision Mascot"
            className="w-80 h-80 mr-4"
          />
          <div className="flex flex-col gap-4">
            <div className="relative border-2 border-gray-300 bg-white p-4 rounded-lg shadow-md">
              <div className="relative z-20">
                <h2 className="text-2xl font-bold mb-2">Bem vindo ao OncoVision</h2>
                <p className="text-muted-foreground">
                  Anexe seu arquivo e veja dados de forma mais simplificada
                </p>
              </div>
              <div className="z-10 absolute border-2 border-gray-300 border-r-white border-t-white -left-5 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rotate-45"></div>
            </div>
            <div className="border-2 border-gray-300 relative bg-white p-4 text-center rounded-lg shadow-md">
              <div className="relative z-20">
                <h2 className="text-md mb-2">Se seu arquivo não estiver no formato CSV. clique abaixo para converter</h2>
                <button className="bg-pink-400 hover:bg-pink-600 border-none text-black px-4 py-2 text-sm mt-4 rounded-md"
                  onClick={() => {
                    window.open("https://convertio.co/pt/conversor-csv/", "_blank");
                  }}
                >Converter</button>
              </div>
              <div className="absolute border-2 border-gray-300 border-r-white border-t-white  -left-5 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rotate-45"></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup; 