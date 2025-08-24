import { zodResolver } from "@hookform/resolvers/zod";
import { FloppyDisk, TrashSimple } from "@phosphor-icons/react";
import {
  Alert,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/reactive-resume";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AGENT_MODELS,
  AGENTS,
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODELS,
} from "@/constants/llm";
import { useAgentAiStore } from "@/stores/agent-ai";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/reactive-resume/select";
import { agentType } from "@/models/agent-ai";

const formSchema = z.object({
  apiKey: z.string().min(1, "API key cannot be empty.").default(""),
  agentName: z.enum(AGENTS),
  baseURL: z
    .string()
    .regex(/^https?:\/\/\S+$/, "That doesn't look like a valid URL")
    .or(z.literal(""))
    .default(""),
  model: z.enum(AGENT_MODELS),
  maxTokens: z.number().default(DEFAULT_MAX_TOKENS),
});

type FormValues = z.infer<typeof formSchema>;

export const OpenAISettings = () => {
  const {
    agentName,
    setAgentName,
    apiKey,
    setApiKey,
    baseURL,
    setBaseURL,
    model,
    setModel,
    maxTokens,
    setMaxTokens,
  } = useAgentAiStore();

  const isEnabled = !!apiKey;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentName: agentName ?? AGENTS[1],
      apiKey: apiKey ?? "",
      baseURL: baseURL ?? "",
      model: model ?? DEFAULT_MODELS[agentName ?? AGENTS[1]],
      maxTokens: maxTokens ?? DEFAULT_MAX_TOKENS,
    },
  });

  const onSubmit = ({
    agentName,
    apiKey,
    baseURL,
    model,
    maxTokens,
  }: FormValues) => {
    setApiKey(apiKey);
    setAgentName(agentName);
    if (baseURL) {
      setBaseURL(baseURL);
    }
    if (model) {
      setModel(model);
    }
    if (maxTokens) {
      setMaxTokens(maxTokens);
    }
  };

  const onRemove = () => {
    setApiKey(null);
    setBaseURL(null);
    setAgentName(AGENTS[1]);
    setModel(DEFAULT_MODELS[AGENTS[1]]);
    setMaxTokens(DEFAULT_MAX_TOKENS);
    form.reset({
      agentName: AGENTS[1],
      apiKey: "",
      baseURL: "",
      model: DEFAULT_MODELS[AGENTS[1]],
      maxTokens: DEFAULT_MAX_TOKENS,
    });
  };

  // add agent select ************
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold leading-relaxed tracking-tight">{t`OpenAI/Ollama Integration`}</h3>

      <Form {...form}>
        <form
          className="grid gap-6 sm:grid-cols-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="agentName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t`Agent`}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: agentType) => {
                      form.setValue("model", DEFAULT_MODELS[value]);
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t`Please select a file type`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AGENTS[1]}>Gemini</SelectItem>
                      <SelectItem value={AGENTS[0]}>Open AI</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="model"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t`Model`}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t`Please select a file type`} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* {form.watch('agentName') == AGENTS[0] &&<SelectItem value={AGENT_MODELS[0]}>{AGENT_MODELS[0]}</SelectItem>}
                      {form.watch('agentName') == AGENTS[1] && <SelectItem value={AGENT_MODELS[1]}>{AGENT_MODELS[1]}</SelectItem>} */}
                      <SelectItem
                        value={AGENT_MODELS[0]}
                        className={`${
                          form.watch("agentName") == AGENTS[0] ? "" : "hidden"
                        }`}
                      >
                        {AGENT_MODELS[0]}
                      </SelectItem>
                      <SelectItem
                        value={AGENT_MODELS[1]}
                        className={`${
                          form.watch("agentName") == AGENTS[1] ? "" : "hidden"
                        }`}
                      >
                        {AGENT_MODELS[1]}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="apiKey"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-1 sm:col-span-2">
                <FormLabel>{t`OpenAI/Ollama API Key`}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="sk-..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="baseURL"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t`Base URL`}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="http://localhost:11434/v1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="maxTokens"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t`Max Tokens`}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`${DEFAULT_MAX_TOKENS}`}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.valueAsNumber);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2 self-end sm:col-start-2">
            <Button type="submit" disabled={!form.formState.isValid}>
              {isEnabled && <FloppyDisk className="mr-2" />}
              {isEnabled ? t`Saved` : t`Save Locally`}
            </Button>

            {isEnabled && (
              <Button type="reset" variant="ghost" onClick={onRemove}>
                <TrashSimple className="mr-2" />
                {t`Forget`}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
