"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pacifico } from "next/font/google";
import { useTranslations } from "next-intl";

import { HighlightPopover } from "@/components/highlight-popover";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

export default function DialecticalGraphPage() {
  const t = useTranslations("thinking");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");

  return (
    <article className="min-h-screen w-full flex items-start justify-center p-4 md:p-8 bg-dotted-pattern bg-fixed leading-8">
      <Frame className="w-full max-w-3xl my-8">
        <FramePanel>
          <div className="flex items-start justify-between mb-6">
            <div>
              <FrameTitle
                className={`${pacifico.className} text-4xl text-foreground -rotate-1.5 inline-block`}
              >
                {t("title")}
              </FrameTitle>
              <FrameDescription>{t("subtitle")}</FrameDescription>
            </div>
            <LanguageSwitcher />
          </div>

          <div className="space-y-6">
            <Separator />

            <p>
              {t("intro")}{" "}
              <Link
                href="/meltdown-protocol"
                className="text-blue-500 hover:underline"
              >
                {t("meltdownLink")}
              </Link>
              {t("introCont1")}{" "}
              <Link href="/" className="text-blue-500 hover:underline">
                {t("coscientist")}
              </Link>{" "}
              {t("introCont2")}
            </p>

            <p>{t("searchApproaches")}</p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("limitsRAG")}
            </h2>

            <p>{t("limitsRAGIntro")}</p>

            <Alert variant="warning" className="my-6">
              <AlertTitle>{t("limitsRAGTitle")}</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-6 mt-3 space-y-3">
                  <li>
                    <strong>{t("quantBias")}</strong> {t("quantBiasDesc")}
                  </li>
                  <li>
                    <strong>{t("absenceRelations")}</strong>{" "}
                    {t("absenceRelationsDesc")}
                  </li>
                  <li>
                    <strong>{t("unclearProvenance")}</strong>{" "}
                    {t("unclearProvenanceDesc")}
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            <p>
              {t("ragReplaces")}{" "}
              <HighlightPopover
                triggerContent={t("knowledgeUpdating")}
                popoverTitle={t("knowledgeUpdatingTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("knowledgeUpdatingDesc")}
                  </p>
                }
              />{" "}
              {t("reordering")}{" "}
              <HighlightPopover
                triggerContent={t("knowledgeSynthesis")}
                popoverTitle={t("knowledgeSynthesisTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("knowledgeSynthesisDesc")}
                  </p>
                }
              />{" "}
              {t("cohering")}
            </p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("dialecticalModel")}
            </h2>

            <p>{t("dialecticalIntro")}</p>

            <p>{t("contradictionPriority")}</p>

            <Alert variant="info" className="my-6">
              <AlertTitle>{t("keyPrinciple")}</AlertTitle>
              <AlertDescription>
                <p className="mt-2">{t("keyPrincipleContent")}</p>
              </AlertDescription>
            </Alert>

            <p>{t("tripleSeparation")}</p>

            <p>{t("ragCollects")}</p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("graphStructure")}
            </h2>

            <h3 className="text-xl font-semibold pt-2">{t("nodes")}</h3>

            <div className="flex flex-wrap gap-2 my-4">
              <Badge variant="outline">{t("claim")}</Badge>
              <Badge variant="outline">{t("scope")}</Badge>
              <Badge variant="outline">{t("assumption")}</Badge>
              <Badge variant="outline">{t("definition")}</Badge>
              <Badge variant="outline">{t("method")}</Badge>
              <Badge variant="outline">{t("data")}</Badge>
              <Badge variant="outline">{t("evidenceSpan")}</Badge>
              <Badge variant="outline">{t("source")}</Badge>
              <Badge variant="outline">{t("counterexample")}</Badge>
              <Badge variant="outline">{t("issue")}</Badge>
            </div>

            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>
                <code className="bg-muted px-1 rounded">{t("claim")}</code>:{" "}
                {t("claimDesc")}
              </li>
              <li>
                <code className="bg-muted px-1 rounded">{t("scope")}</code>:{" "}
                {t("scopeDesc")}
              </li>
              <li>
                <code className="bg-muted px-1 rounded">{t("assumption")}</code>
                : {t("assumptionDesc")}
              </li>
              <li>
                <code className="bg-muted px-1 rounded">{t("definition")}</code>
                : {t("definitionDesc")}
              </li>
              <li>
                <code className="bg-muted px-1 rounded">{t("method")}</code>:{" "}
                {t("methodDesc")}
              </li>
              <li>
                <code className="bg-muted px-1 rounded">{t("data")}</code>:{" "}
                {t("dataDesc")}
              </li>
              <li>
                <code className="bg-muted px-1 rounded">
                  {t("evidenceSpan")}
                </code>
                : {t("evidenceSpanDesc")}
              </li>
              <li>
                <code className="bg-muted px-1 rounded">{t("source")}</code>:{" "}
                {t("sourceDesc")}
              </li>
              <li>
                <code className="bg-muted px-1 rounded">
                  {t("counterexample")}
                </code>
                : {t("counterexampleDesc")}
              </li>
              <li>
                <code className="bg-muted px-1 rounded">{t("issue")}</code>:{" "}
                {t("issueDesc")}
              </li>
            </ol>

            <h3 className="text-xl font-semibold pt-4">{t("edges")}</h3>

            <div className="flex flex-wrap gap-2 my-4">
              <Badge>{t("supports")}</Badge>
              <Badge>{t("attacks")}</Badge>
              <Badge variant="destructive">{t("undercuts")}</Badge>
              <Badge variant="secondary">{t("refines")}</Badge>
              <Badge variant="secondary">{t("generalizes")}</Badge>
              <Badge variant="secondary">{t("specializes")}</Badge>
              <Badge variant="outline">{t("dependsOn")}</Badge>
              <Badge variant="outline">{t("defines")}</Badge>
              <Badge variant="outline">{t("measures")}</Badge>
              <Badge variant="outline">{t("cites")}</Badge>
              <Badge variant="info">{t("replicates")}</Badge>
              <Badge variant="error">{t("failsToReplicate")}</Badge>
              <Badge variant="warning">{t("contradicts")}</Badge>
              <Badge variant="outline">{t("isAbout")}</Badge>
            </div>

            <Alert variant="info" className="my-6">
              <AlertTitle>{t("whyUndercuts")}</AlertTitle>
              <AlertDescription>
                <p className="mt-2">{t("whyUndercutsContent1")}</p>
                <p className="mt-2">{t("whyUndercutsContent2")}</p>
              </AlertDescription>
            </Alert>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("contradictionFirst")}
            </h2>

            <p>{t("contradictionFirstIntro")}</p>

            <p>
              {t("claimConditioned").split(t("maximizeAttacking"))[0]}
              <HighlightPopover
                triggerContent={t("maximizeAttacking")}
                popoverTitle={t("adversarialTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("adversarialDesc")}
                  </p>
                }
              />
              {t("claimConditioned").split(t("maximizeAttacking"))[1] || ""}
            </p>

            <p>{t("argumentTheory")}</p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("qualityOverQuantity")}
            </h2>

            <p>{t("qualityIntro")}</p>

            <p>{t("qualityAxes")}</p>

            <p>{t("claimStatus")}</p>

            <div className="flex flex-wrap gap-2 my-4">
              <Badge variant="outline">{t("tentative")}</Badge>
              <Badge variant="warning">{t("contested")}</Badge>
              <Badge variant="info">{t("conditionallySupported")}</Badge>
              <Badge variant="success">{t("robust")}</Badge>
              <Badge variant="destructive">{t("refuted")}</Badge>
              <Badge variant="secondary">{t("obsolete")}</Badge>
            </div>

            <p>{t("stateTransitions")}</p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("aiAgents")}
            </h2>

            <p>{t("aiAgentsIntro")}</p>

            <ol className="list-decimal pl-6 space-y-2">
              <li>{t("agent1")}</li>
              <li>{t("agent2")}</li>
              <li>{t("agent3")}</li>
              <li>{t("agent4")}</li>
              <li>{t("agent5")}</li>
              <li>{t("agent6")}</li>
              <li>{t("agent7")}</li>
              <li>{t("agent8")}</li>
            </ol>

            <Alert variant="info" className="my-6">
              <AlertTitle>{t("collideTitle")}</AlertTitle>
              <AlertDescription>
                <p className="mt-2">{t("collideContent")}</p>
              </AlertDescription>
            </Alert>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("knowledgeSynthesisSection")}
            </h2>

            <p>{t("synthesisIntro")}</p>

            <p>{t("synthesisDecompose")}</p>

            <p>
              <HighlightPopover
                triggerContent={t("synthesisNotAveraging")}
                popoverTitle={t("synthesisTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("synthesisDesc")}
                  </p>
                }
              />
              ; {t("synthesisExplain")}
            </p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("meltdownPrevention")}
            </h2>

            <p>{t("preventionIntro")}</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>{t("inferenceLayer")}</strong>
              </li>
              <li>
                <strong>{t("narrativeLayer")}</strong>
              </li>
            </ul>

            <p>{t("documentSnapshot")}</p>

            <Alert variant="error" className="my-6">
              <AlertTitle>{t("theRule")}</AlertTitle>
              <AlertDescription>
                <p className="mt-2">{t("theRuleContent")}</p>
              </AlertDescription>
            </Alert>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("explorationStrategies")}
            </h2>

            <p>{t("explorationIntro")}</p>

            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>{t("counterexampleFirst")}</strong>
                <p className="text-muted-foreground mt-1">
                  {t("counterexampleFirstDesc")}
                </p>
              </li>
              <li>
                <strong>{t("minCut")}</strong>
                <p className="text-muted-foreground mt-1">{t("minCutDesc")}</p>
              </li>
              <li>
                <strong>{t("definitionDrift")}</strong>
                <p className="text-muted-foreground mt-1">
                  {t("definitionDriftDesc")}
                </p>
              </li>
              <li>
                <strong>{t("methodConclusion")}</strong>
                <p className="text-muted-foreground mt-1">
                  {t("methodConclusionDesc")}
                </p>
              </li>
              <li>
                <strong>{t("replicationPath")}</strong>
                <p className="text-muted-foreground mt-1">
                  {t("replicationPathDesc")}
                </p>
              </li>
            </ol>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("editorRole")}
            </h2>

            <p>{t("editorRoleIntro")}</p>

            <p>{t("mapContradictions")}</p>

            <p>
              <HighlightPopover
                triggerContent={t("editorInitiative")}
                popoverTitle={t("editorInitiativeTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("editorInitiativeDesc")}
                  </p>
                }
              />
              {t("editorConclusion")}
            </p>

            <p>{t("ecosystem")}</p>
          </div>
        </FramePanel>
        <FrameFooter>
          <div className="flex justify-between w-full items-center">
            <Link
              href="/meltdown-protocol"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              <span>{tn("meltdownProtocol")}</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              &copy; {tc("copyright")}
            </p>
          </div>
        </FrameFooter>
      </Frame>
    </article>
  );
}
