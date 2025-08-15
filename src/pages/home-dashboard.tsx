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

const Home = () => {
  const { login } = useLogin();
  return (
    <div>
      <div>
        Home
        <button
          onClick={async () => {
            await login({ identifier: "string", password: "" });
          }}
        >
          Login
        </button>
        <Button
          onClick={() => {
            const id = customToast({
              title: "This is a headless toast",
              description:
                "You have full control of styles and jsx, while still having the animations.",
              buttonOk: {
                label: "Reply",
                onClick: () => toast.dismiss(id),
              },
              buttonCancel: {
                label: "Canel",
                onClick: () => toast.dismiss(id),
              },
            });
          }}
        >
          Button
        </Button>
        <Checkbox />
        <ClipboardApp />
        <div>
          Side bar
          <Button
            onClick={() => {
              const settingWindow = new WebviewWindow(
                WINDOW_LABEL.CLIPBOARD,
                WINDOW_CONFIGS[WINDOW_LABEL.CLIPBOARD]
              );
              settingWindow.once("tauri://created", async function () {
                // do the initial action pass from current window
              });
            }}
          >
            New Win
          </Button>
        </div>
        <div>
          {t`Here, you can update your profile to customize and personalize your experience.`}
        </div>
        <hr />
        <Button
          onClick={async () => {
            const result = await fixGrammar("I am go to an mall.");
            console.log(555, result);
          }}
        >
          Ai Test
        </Button>
      </div>
    </div>
  );
};

export default Home;
