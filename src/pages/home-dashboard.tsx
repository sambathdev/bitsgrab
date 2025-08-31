import { useLogin } from "@/services/auth";
import ClipboardApp from "./child/clipboard-app/page";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { customToast } from "@/components/ui/toast";
import { toast } from "sonner";
import { t } from "@lingui/core/macro";
import { WINDOW_CONFIGS, WINDOW_LABEL } from "@/constants";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { fixGrammar } from "@/services/agent-ai";
import { invoke } from "@tauri-apps/api/core";

const Home = () => {
  const { login } = useLogin();
  return (
    <div className="p-2">
      <div>Home</div>
    </div>
  );
};

export default Home;
