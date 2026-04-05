import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import BackToTransferButton from "@/components/BackToTransferButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, CheckCircle, QrCode } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";

export default function PixQrCode() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<
    "idle" | "granted" | "denied"
  >("idle");
  const [decodedText, setDecodedText] = useState("");
  const readerElementId = "pix-qr-reader";

  const startScanner = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerElementId);
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (text) => {
          setDecodedText(text);
          toast.success("QR Code lido com sucesso!");
          stopScanner();
        },
        () => {
          // erro de leitura por frame; pode ignorar
        }
      );

      setCameraPermission("granted");
      setIsScanning(true);
    } catch (error) {
      console.error(error);
      setCameraPermission("denied");
      toast.error("Não foi possível acessar a câmera.", {
        description: "Verifique a permissão no navegador.",
      });
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch (error) {
      console.error("Erro ao parar scanner:", error);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <BackToTransferButton />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Ler QR Code</h1>
            <p className="text-muted-foreground mt-2">
              Use a câmera do dispositivo para ler um QR Code Pix
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Scanner Pix
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Aponte a câmera para o QR Code
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div
                id={readerElementId}
                className="w-full overflow-hidden rounded-xl"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!isScanning ? (
                <Button type="button" onClick={startScanner}>
                  <Camera className="w-4 h-4 mr-2" />
                  Ativar câmera
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={stopScanner}>
                  <CameraOff className="w-4 h-4 mr-2" />
                  Parar leitura
                </Button>
              )}
            </div>

            {cameraPermission === "denied" && (
              <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/10 text-sm text-destructive">
                Permissão de câmera negada. Libere o acesso no navegador e tente
                novamente.
              </div>
            )}

            {decodedText && (
              <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/10">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  QR Code lido
                </div>
                <p className="text-sm text-green-700 dark:text-green-400 mt-2 break-all">
                  {decodedText}
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Permissão da câmera
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                O navegador pedirá acesso à câmera ao iniciar o leitor.
              </p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="p-4 rounded-lg bg-secondary">
                Use de preferência a câmera traseira em celulares para melhor leitura.
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                Caso negue a permissão, você pode habilitá-la manualmente nas
                configurações do navegador.
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                Em um fluxo real, o QR lido seria processado para validar
                destinatário, valor e cobrança.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}