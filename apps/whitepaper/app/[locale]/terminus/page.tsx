"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pacifico } from "next/font/google";
import { useTranslations } from "next-intl";

import { HighlightPopover } from "@/components/highlight-popover";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

export default function TerminusPage() {
  const t = useTranslations("terminus");
  const tc = useTranslations("common");

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

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("darkNight")}
            </h2>

            <p>{t("darkNightIntro")}</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>{t("nightIs")}</strong>
              </li>
              <li>{t("rewardsNoWork")}</li>
              <li>{t("attachmentsExposed")}</li>
              <li>
                {t("recoveryNot")}{" "}
                <HighlightPopover
                  triggerContent={t("rebuildStandards")}
                  popoverTitle={t("reconstructionTitle")}
                  popoverContent={
                    <p className="text-muted-foreground leading-relaxed">
                      {t("reconstructionDescription")}
                    </p>
                  }
                />
                .
              </li>
            </ul>

            <p>{t("encyclopediaIntro")}</p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("foundation")}
            </h2>

            <p>
              {t("foundationIntro")}{" "}
              <HighlightPopover
                triggerContent={t("foundationName")}
                popoverTitle={t("foundationTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("foundationDescription")}
                  </p>
                }
              />
              {t("foundationCont")}{" "}
              <HighlightPopover
                triggerContent={t("psychohistory")}
                popoverTitle={t("psychohistoryTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("psychohistoryDescription")}
                  </p>
                }
              />{" "}
              {t("psychohistoryExplain")}
            </p>

            <p>{t("seldonConcludes")}</p>

            <ol className="list-decimal pl-6 space-y-2">
              <li>{t("collapse1")}</li>
              <li>{t("collapse2")}</li>
              <li>{t("collapse3")}</li>
            </ol>

            <Alert variant="info" className="my-6">
              <AlertTitle>{t("seldonPlan")}</AlertTitle>
              <AlertDescription>
                <p className="mt-2">{t("seldonPlanDesc1")}</p>
                <p className="mt-2">{t("seldonPlanDesc2")}</p>
              </AlertDescription>
            </Alert>

            <p>{t("seldonBroader")}</p>

            <p>
              {t("seldonBreaks")}{" "}
              <a
                href="https://en.wikipedia.org/wiki/Knowledge_ark"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {t("knowledgeArk")}
              </a>{" "}
              {t("knowledgeArkCont")}
            </p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("myEncyclopedia")}
            </h2>

            <p>
              {t("myEncyclopediaIntro")}{" "}
              <HighlightPopover
                triggerContent={t("engineNewOrder")}
                popoverTitle={t("engineTitle")}
                popoverContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {t("engineDescription")}
                  </p>
                }
              />
              .
            </p>
          </div>
        </FramePanel>
        <FrameFooter>
          <div className="flex justify-between w-full items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              <span>{tc("backToHome")}</span>
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
