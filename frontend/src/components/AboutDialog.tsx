import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AboutDialogProps {
    open: boolean;
    onClose: () => void;
}

const AboutDialog = ({ open, onClose }: AboutDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent className="w-[90vw] max-w-[500px] p-4 sm:p-6 md:p-8">
                <div className="flex flex-col gap-4 md:gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        <img
                            src="/logo.png"
                            alt="OncoVision"
                            className="h-8 w-8 sm:h-16 sm:w-16"
                        />
                        <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">OncoVision</h2>
                    </div>

                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground">
                        <p className="text-center sm:text-left leading-relaxed">
                            A OncoVision é uma plataforma inovadora projetada para auxiliar profissionais de saúde na análise de dados oncológicos.
                            Nossa plataforma utiliza avançadas técnicas de visualização de dados para transformar informações complexas em insights claros e acionáveis.
                        </p>

                        <p className="text-center sm:text-left leading-relaxed">
                            Nossa missão é simplificar a análise de dados oncológicos, permitindo uma compreensão mais profunda dos padrões e tendências,
                            contribuindo assim para melhores decisões no tratamento do câncer.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AboutDialog;
