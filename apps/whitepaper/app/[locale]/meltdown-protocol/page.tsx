"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pacifico } from "next/font/google";
import { useTranslations } from "next-intl";

import { HighlightPopover } from "@/components/highlight-popover";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function MeltdownPage() {
  const t = useTranslations("meltdown");
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
              <HighlightPopover
                triggerContent={t("coscientist")}
                popoverTitle={t("coscientistTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("coscientistDescription")}
                  </p>
                }
              />{" "}
              {t("introCont")}
            </p>

            <Alert variant="error" className="my-6">
              <AlertTitle>{t("meltdownTitle")}</AlertTitle>
              <AlertDescription>
                <p className="mt-2">{t("meltdownDefinition")}</p>
              </AlertDescription>
            </Alert>

            <p>{t("meltdownEffect1")}</p>

            <p>
              {t("meltdownEffect2").split(t("linksTrust"))[0]}
              <HighlightPopover
                triggerContent={t("linksTrust")}
                popoverTitle={t("linksTrustTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("linksTrustDescription")}
                  </p>
                }
              />
              {t("meltdownEffect2").split(t("linksTrust"))[1] || ""}
            </p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("defense")}
            </h2>

            <p>
              <Link href="/" className="text-blue-500 hover:underline">
                Coscientist
              </Link>{" "}
              {t("defenseIntro")}{" "}
              <HighlightPopover
                triggerContent={t("unBrainRot")}
                popoverTitle={t("unBrainRotTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("unBrainRotDescription")}
                  </p>
                }
              />{" "}
              {t("defenseCont")}
            </p>

            <p>{t("sovereignty")}</p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("protocol")}
            </h2>

            <p>{t("protocolIntro")}</p>

            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>{t("teamOfFive")}</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>{t("teamOfFiveDesc1")}</li>
                  <li>{t("teamOfFiveDesc2")}</li>
                  <li>{t("teamOfFiveDesc3")}</li>
                  <li>{t("teamOfFiveDesc4")}</li>
                  <li>{t("teamOfFiveDesc5")}</li>
                </ul>
              </li>
              <li>
                <strong>{t("uncertainty")}</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>{t("uncertaintyDesc1")}</li>
                  <li>{t("uncertaintyDesc2")}</li>
                  <li>{t("uncertaintyDesc3")}</li>
                </ul>
              </li>
              <li>
                <strong>{t("rebuttal")}</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>{t("rebuttalDesc")}</li>
                </ul>
              </li>
              <li>
                <strong>{t("questions")}</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>{t("questionsDesc")}</li>
                </ul>
              </li>
            </ul>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("deliberation")}
            </h2>

            <p>{t("deliberationIntro")}</p>

            <div className="space-y-4 my-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-success-foreground">
                    {t("geminiTitle")}
                  </CardTitle>
                  <CardDescription>{t("geminiDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{t("geminiContent1")}</p>
                  <p>{t("geminiContent2")}</p>
                  <p>{t("geminiContent3")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">
                    {t("claudeTitle")}
                  </CardTitle>
                  <CardDescription>{t("claudeDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{t("claudeContent1")}</p>
                  <p>
                    <strong>{t("claudeContent2")}</strong>
                  </p>
                  <p>{t("claudeContent3")}</p>
                  <Alert variant="info" className="mt-4">
                    <AlertTitle>{t("editorNote")}</AlertTitle>
                    <AlertDescription className="text-sm">
                      <p className="mt-2">{t("editorNoteContent")}</p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-warning-foreground">
                    {t("chatgptTitle")}
                  </CardTitle>
                  <CardDescription>{t("chatgptDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{t("chatgptContent1")}</p>
                  <p>{t("chatgptContent2")}</p>
                  <p>{t("chatgptContent3")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-success-foreground">
                    {t("grokTitle")}
                  </CardTitle>
                  <CardDescription>{t("grokDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>{t("grokStrengths")}</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{t("grokStrength1")}</li>
                    <li>{t("grokStrength2")}</li>
                    <li>{t("grokStrength3")}</li>
                  </ul>
                  <p className="mt-3">
                    <strong>{t("grokWeaknesses")}</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{t("grokWeakness1")}</li>
                    <li>{t("grokWeakness2")}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <p>{t("verdict")}</p>

            <Alert variant="info" className="my-6">
              <AlertTitle>{t("intent")}</AlertTitle>
              <AlertDescription>
                <p className="mt-2">{t("intentContent")}</p>
              </AlertDescription>
            </Alert>
          </div>
        </FramePanel>
        <FrameFooter>
          <div className="flex justify-between w-full items-center">
            <Link
              href="/terminus"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              <span>{tn("terminus")}</span>
            </Link>
            <Link
              href="/thinking-computers"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{tn("thinkingComputers")}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
          </div>
        </FrameFooter>
      </Frame>
    </article>
  );
}
