import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BackToTransferButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => navigate("/transfer")}
      className="w-fit px-0 text-base font-semibold hover:bg-transparent hover:text-primary"
    >
      <ArrowLeft className="w-8 h-8 mr-2" />
      Voltar
    </Button>
  );
}