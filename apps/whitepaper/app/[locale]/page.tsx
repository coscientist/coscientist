"use client";

import { HighlightPopover } from "@/components/highlight-popover";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { Pacifico } from "next/font/google";
import { Link } from "@/i18n/navigation";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Page() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  const FootnoteContent = {
    1: (
      <p className="text-muted-foreground leading-relaxed">
        {t("alwaysOnDescription")}
      </p>
    ),
    2: (
      <p className="text-muted-foreground leading-relaxed">
        {t("forgetKnowingDescription")}
      </p>
    ),
    3: (
      <p className="text-muted-foreground leading-relaxed">
        {t("responsibilityDescription")}
      </p>
    ),
    4: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-2">
          {t("meltdownDescription1")}
        </p>
        <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-2">
          <li>{t("meltdownItem1")}</li>
          <li>{t("meltdownItem2")}</li>
          <li>{t("meltdownItem3")}</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          {t("meltdownDescription2")}
        </p>
      </>
    ),
    5: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-3">
          {t("undercutDescription1")}
        </p>
        <p className="text-muted-foreground leading-relaxed mb-3">
          {t("undercutDescription2")}
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {t("undercutDescription3")}
        </p>
      </>
    ),
    6: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-3">
          {t("ragFailDescription1")}
        </p>
        <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-3">
          <li>{t("ragFailItem1")}</li>
          <li>{t("ragFailItem2")}</li>
          <li>{t("ragFailItem3")}</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          {t("ragFailDescription2")}
        </p>
      </>
    ),
    7: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-3">
          {t("scienceOpsDescription1")}
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {t("scienceOpsDescription2")}
        </p>
      </>
    ),
    9: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-3">
          {t("taglineDescription1")}
        </p>
        <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-3">
          <li>{t("taglineItem1")}</li>
          <li>{t("taglineItem2")}</li>
          <li>{t("taglineItem3")}</li>
          <li>{t("taglineItem4")}</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          {t("taglineDescription2")}
        </p>
      </>
    ),
  };

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
              <FrameDescription>
                <HighlightPopover
                  triggerContent={t("subtitle")}
                  popoverTitle={t("whatIs")}
                  popoverContent={
                    <p className="text-muted-foreground leading-relaxed">
                      {t("whatIsDescription")}
                    </p>
                  }
                />
              </FrameDescription>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="space-y-6">
            <Separator />

            <p>{t("intro1")}</p>

            <p>{t("intro2")}</p>

            <p>{t("intro3")}</p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("worldChanged")}
            </h2>

            <p>
              {t("worldChanged1")}{" "}
              <HighlightPopover
                triggerContent={t("forgetKnowing")}
                popoverTitle={t("forgetKnowingTitle")}
                popoverContent={FootnoteContent[2]}
              />
            </p>

            <p>{t("dangerousFail")}</p>

            <p>
              {t("meltdownIntro")}{" "}
              <HighlightPopover
                triggerContent={t("encyclopediaMeltdown")}
                popoverTitle={t("meltdownTitle")}
                popoverContent={FootnoteContent[4]}
              />{" "}
              {t("meltdownExplain")}
            </p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("myResponse")}
            </h2>

            <p>
              <Link
                href="https://coscientist.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Coscientist
              </Link>{" "}
              {t("coscientistDescription")}{" "}
              <HighlightPopover
                triggerContent={t("momentVerifies")}
                popoverTitle={t("alwaysOnTitle")}
                popoverContent={FootnoteContent[1]}
              />
            </p>

            <p>
              {t.rich("taglineExplain", {
                tagline: () => (
                  <HighlightPopover
                    triggerContent={t("tagline")}
                    popoverTitle={t("taglineTitle")}
                    popoverContent={FootnoteContent[9]}
                  />
                ),
              }) || (
                <>
                  <HighlightPopover
                    triggerContent={t("tagline")}
                    popoverTitle={t("taglineTitle")}
                    popoverContent={FootnoteContent[9]}
                  />{" "}
                  {t("taglineExplain")}
                </>
              )}
            </p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("protectsAgency")}
            </h2>

            <p>
              {t("agencyExplain")}{" "}
              <HighlightPopover
                triggerContent={t("quietDefault")}
                popoverTitle={t("alwaysOnTitle")}
                popoverContent={FootnoteContent[1]}
              />
              {t("quietExplain")}
            </p>

            <p>
              {t("responsibilityExplain").split(t("responsibilityLine"))[0]}
              <HighlightPopover
                triggerContent={t("responsibilityLine")}
                popoverTitle={t("responsibilityTitle")}
                popoverContent={FootnoteContent[3]}
              />{" "}
              {t("responsibilityExplain").split(t("responsibilityLine"))[1] ||
                ""}
            </p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("differentProduct")}
            </h2>

            <p>{t("differentExplain")}</p>

            <p>
              {t("separates")}{" "}
              <HighlightPopover
                triggerContent={t("narrativeInference")}
                popoverTitle={t("undercutTitle")}
                popoverContent={FootnoteContent[5]}
              />
            </p>

            <p>
              <em>{t("narrative")}</em> {t("narrativeExplain")}
            </p>

            <p>
              <em>{t("inference")}</em> {t("inferenceExplain")}
            </p>

            <p>
              {t("distinctionMatters")}{" "}
              <HighlightPopover
                triggerContent={t("whetherUndercuts")}
                popoverTitle={t("ragFailTitle")}
                popoverContent={FootnoteContent[6]}
              />{" "}
              {t("narrativeOutrun")}
            </p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("preventDrift")}
            </h2>

            <p>{t("usefulPlaces")}</p>

            <p>{t("personalSide")}</p>

            <p>
              {t("scientificSide")}{" "}
              <HighlightPopover
                triggerContent={t("reproducibility")}
                popoverTitle={t("scienceOpsTitle")}
                popoverContent={FootnoteContent[7]}
              />
            </p>

            <p>{t("ambitionConverge")}</p>

            <p>{t("hardProblems")}</p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("bringMachinery")}
            </h2>

            <p>{t("machineryExplain")}</p>

            <p>{t("remainsCalm")}</p>

            <p>{t("calmExplain")}</p>

            <h2
              className={`${pacifico.className} text-3xl text-foreground inline-block pt-4`}
            >
              {t("ifWorks")}
            </h2>

            <p>
              {t("rhythmExplain")}{" "}
              <HighlightPopover
                triggerContent={t("provenanceNotOptional")}
                popoverTitle={t("responsibilityTitle")}
                popoverContent={
                  <>
                    {FootnoteContent[3]}
                    <Separator className="my-4" />
                    {FootnoteContent[7]}
                  </>
                }
              />
            </p>

            <p>
              {t("notAGI")}{" "}
              <HighlightPopover
                triggerContent={t("coScientist")}
                popoverTitle={t("taglineTitle")}
                popoverContent={FootnoteContent[9]}
              />
            </p>
          </div>
        </FramePanel>
        <FrameFooter>
          <p className="text-muted-foreground text-sm text-end">
            &copy; {tc("copyright")}
          </p>
        </FrameFooter>
      </Frame>
    </article>
  );
}
