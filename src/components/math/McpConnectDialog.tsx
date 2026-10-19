import { useState } from "react";
import { Check, Copy, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MCP_URL = "https://lxzoyhmtcxpjqdihdsmo.supabase.co/functions/v1/foroagora-math";

const jsonConfig = JSON.stringify({ mcpServers: { "foroagora-maths": { url: MCP_URL } } }, null, 2);
const claudeCodeCmd = `claude mcp add --transport http foroagora-maths ${MCP_URL}`;

const CopyBlock = ({ text }: { text: string }) => {
  const [done, setDone] = useState(false);
  return (
    <div className="relative">
      <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-md border border-border bg-muted p-3 pr-12 text-xs text-foreground">{text}</pre>
      <Button
        type="button" size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8"
        aria-label="Copier"
        onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      >
        {done ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

const Steps = ({ items }: { items: string[] }) => (
  <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">{items.map((s) => <li key={s}>{s}</li>)}</ol>
);

const McpConnectDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="Connecter à ton assistant IA" title="Connecter à ton assistant IA"><Plug /></Button>
    </DialogTrigger>
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Connecter les maths à ton assistant IA</DialogTitle>
        <DialogDescription>
          Ajoute le serveur MCP Foro Agora pour que ton IA puisse chercher les exercices, les chapitres, les DM et les khôlles.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Adresse du serveur</p>
        <CopyBlock text={MCP_URL} />
      </div>
      <Tabs defaultValue="claude">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="claude">Claude</TabsTrigger>
          <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
          <TabsTrigger value="cursor">Cursor</TabsTrigger>
          <TabsTrigger value="autre">Autre</TabsTrigger>
        </TabsList>
        <TabsContent value="claude" className="space-y-3">
          <Steps items={[
            "Ouvre Claude (site ou application) → Paramètres → Connecteurs.",
            "Clique sur « Ajouter un connecteur personnalisé ».",
            "Nom : Foro Agora Maths, puis colle l'adresse du serveur ci-dessus.",
            "Active le connecteur dans une conversation et demande par exemple : « Donne-moi l'exercice #224 ».",
          ]} />
          <p className="text-sm text-muted-foreground">Avec Claude Code, lance simplement :</p>
          <CopyBlock text={claudeCodeCmd} />
        </TabsContent>
        <TabsContent value="chatgpt" className="space-y-3">
          <Steps items={[
            "Ouvre ChatGPT → Paramètres → Applications et connecteurs.",
            "Active le « Mode développeur » dans les paramètres avancés.",
            "Clique sur « Créer », nomme-le Foro Agora Maths et colle l'adresse du serveur.",
            "Authentification : aucune. Enregistre, puis choisis-le dans une nouvelle conversation.",
          ]} />
        </TabsContent>
        <TabsContent value="cursor" className="space-y-3">
          <Steps items={[
            "Ouvre Cursor → Settings → MCP → « Add new MCP server ».",
            "Colle cette configuration dans le fichier mcp.json, puis enregistre.",
          ]} />
          <CopyBlock text={jsonConfig} />
        </TabsContent>
        <TabsContent value="autre" className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Pour tout client compatible MCP (Windsurf, VS Code, LibreChat…), ajoute un serveur de type HTTP avec cette configuration :
          </p>
          <CopyBlock text={jsonConfig} />
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground">Accès en lecture seule, gratuit, sans compte.</p>
    </DialogContent>
  </Dialog>
);

export default McpConnectDialog;
