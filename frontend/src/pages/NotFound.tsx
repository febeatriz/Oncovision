import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <img
              src="/oncovision-mascot.png"
              alt="OncoVision Mascot"
              className="w-32 h-32 opacity-50"
            />
          </div>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl text-muted-foreground mb-2">Página não encontrada</p>
          <p className="text-sm text-muted-foreground">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => navigate("/")}
            className="min-w-[200px]"
          >
            Voltar para Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
