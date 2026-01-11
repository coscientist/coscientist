"use client";

import { ActionButton } from "@/components/action-button";
import { FavoriteButton } from "@/components/favorite-button";
import { HighlightPopover } from "@/components/highlight-popover";
import { MagicMoveWord } from "@/components/magic-move-word";
import { RefreshButton } from "@/components/refresh-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TranslatingQuote } from "@/components/translating-quote";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Frame,
  FramePanel,
  FrameTitle,
  FrameDescription,
  FrameFooter,
} from "@/components/ui/frame";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { cn } from "@/lib/utils";
import { ChartIncreaseIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dancing_Script } from "next/font/google";
import Link from "next/link";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
});

export default function Page() {
  return (
    <article className="min-h-screen w-full flex items-start justify-center p-4 md:p-8 bg-dotted-pattern bg-fixed leading-8">
      <Frame className="w-full max-w-3xl my-8">
        <FramePanel>
          <div className="flex items-start justify-between mb-6">
            <div>
              <FrameTitle
                className={`${dancingScript.className} text-4xl text-foreground -rotate-1.5 inline-block`}
              >
                Lorem Ipsum Dolor Sit Amet
              </FrameTitle>
              <FrameDescription>
                <HighlightPopover
                  triggerContent="Consectetur adipiscing elit"
                  popoverTitle="Popover Example"
                  popoverContent={
                    <p className="text-muted-foreground line-height">
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam.
                    </p>
                  }
                />
              </FrameDescription>
            </div>
            <ThemeToggle />
          </div>
          <div className="space-y-6">
            {/* Alert Component Example */}
            <Alert variant="error" className="w-full md:hidden">
              <AlertTitle>Alert Title Example</AlertTitle>
              <AlertDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <Button
                  className="w-full cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator
                        .share({
                          title: "Lorem Ipsum",
                          text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                          url: window.location.href,
                        })
                        .catch(() => {
                          alert("Share cancelled or not supported.");
                        });
                    }
                  }}
                >
                  Share
                </Button>
              </AlertDescription>
            </Alert>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>

            {/* MagicMoveWord Component Example */}
            <div className="flex justify-center w-full">
              <MagicMoveWord
                scrambledWord="Lorem ipsum dolor"
                correctWord="Sit amet consectetur"
              />
            </div>

            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </p>

            <Separator />

            <h2
              className={`${dancingScript.className} text-3xl text-foreground inline-block pt-6`}
            >
              Section Title Example
            </h2>

            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>

            {/* List with HighlightPopover Examples */}
            <ul className="list-disc pl-8 space-y-1">
              <li>
                <HighlightPopover
                  direction="right"
                  triggerContent="First list item with popover"
                  popoverTitle={
                    <h4 className="text-lg font-bold">
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                        href="https://example.com"
                      >
                        Link Example
                      </Link>
                    </h4>
                  }
                  popoverContent={
                    <p className="text-muted-foreground line-height">
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur
                      aut odit aut fugit.
                    </p>
                  }
                />
              </li>
              <li>
                <HighlightPopover
                  direction="right"
                  triggerContent="Second list item with popover"
                  popoverTitle={
                    <h4 className="text-lg font-bold">Another Title</h4>
                  }
                  popoverContent={
                    <>
                      <p className="text-muted-foreground line-height">
                        Sed quia consequuntur magni dolores eos qui ratione
                        voluptatem sequi nesciunt.
                      </p>
                      <p className="text-muted-foreground line-height">
                        Neque porro quisquam est, qui dolorem ipsum quia dolor
                        sit amet.
                      </p>
                    </>
                  }
                />
              </li>
              <li>
                <HighlightPopover
                  direction="right"
                  triggerContent="Third list item"
                  popoverTitle={
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 italic"
                      href="https://example.com"
                    >
                      <h4 className="text-lg font-bold">
                        <i>Italic quote style title</i>
                      </h4>
                    </Link>
                  }
                  popoverContent={
                    <p className="text-muted-foreground line-height">
                      Consectetur, adipisci velit, sed quia non numquam eius
                      modi tempora incidunt.
                    </p>
                  }
                />
              </li>
            </ul>

            <p>
              Ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad
              minima veniam, quis nostrum exercitationem ullam corporis suscipit
              laboriosam.
            </p>

            {/* TranslatingQuote Component Example */}
            <TranslatingQuote
              quotes={[
                {
                  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                  author: "Cicero",
                  language: "la-LA",
                },
                {
                  text: "The standard Lorem Ipsum passage, used since the 1500s in typesetting and printing previews.",
                  author: "Cicero (translated)",
                  language: "en-US",
                },
              ]}
            />

            <p>
              Quis autem vel eum iure reprehenderit qui in ea voluptate velit
              esse quam nihil molestiae consequatur.
            </p>

            {/* Chart Component Example */}
            <div className="my-4">
              <HighlightPopover
                width="w-lg"
                triggerContent={<i>View chart example</i>}
                popoverTitle="Chart Example"
                popoverContent={
                  <>
                    <ChartContainer
                      config={{
                        openRate: {
                          label: "Open Rate",
                          color: "hsl(var(--chart-1))",
                        },
                        clickRate: {
                          label: "Click Rate",
                          color: "hsl(var(--chart-5))",
                        },
                        CategoryA: {
                          label: "Category A",
                          color: "hsl(var(--chart-1))",
                        },
                        CategoryB: {
                          label: "Category B",
                          color: "hsl(var(--chart-2))",
                        },
                        CategoryC: {
                          label: "Category C",
                          color: "hsl(var(--chart-3))",
                        },
                        CategoryD: {
                          label: "Category D",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                    >
                      <BarChart
                        data={[
                          {
                            label: "Category A",
                            openRate: 80,
                            clickRate: 20,
                            fill: "hsl(var(--chart-1))",
                          },
                          {
                            label: "Category B",
                            openRate: 50,
                            clickRate: 10,
                            fill: "hsl(var(--chart-2))",
                          },
                          {
                            label: "Category C",
                            openRate: 20,
                            clickRate: 4,
                            fill: "hsl(var(--chart-3))",
                          },
                          {
                            label: "Category D",
                            openRate: 15,
                            clickRate: 2,
                            fill: "hsl(var(--chart-4))",
                          },
                        ]}
                        layout="vertical"
                        margin={{
                          left: 0,
                        }}
                      >
                        <YAxis
                          dataKey="label"
                          type="category"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <XAxis dataKey="openRate" type="number" hide />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                          dataKey="openRate"
                          radius={5}
                          fill="hsl(var(--chart-1))"
                        />
                        <Bar
                          dataKey="clickRate"
                          radius={5}
                          fill="hsl(var(--chart-5))"
                        />
                      </BarChart>
                    </ChartContainer>

                    <div className="flex gap-2 font-medium leading-none">
                      Chart Example Title
                      <HugeiconsIcon
                        icon={ChartIncreaseIcon}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Description of chart data point 1
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Description of chart data point 2
                    </div>
                  </>
                }
              />
            </div>

            <h2
              className={`${dancingScript.className} text-3xl text-foreground inline-block pt-6`}
            >
              Another Section
            </h2>

            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores.
            </p>

            {/* YouTubeEmbed Component Example */}
            <Card className="overflow-hidden w-full mx-auto">
              <YouTubeEmbed
                aspectHeight={9}
                aspectWidth={16}
                id="dQw4w9WgXcQ"
                title="Video Example"
              />

              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground text-center">
                  YouTube embed component example
                </p>
              </CardContent>
            </Card>

            <h2
              className={`${dancingScript.className} text-3xl text-foreground inline-block pt-6`}
            >
              Third Section
            </h2>

            <p>
              Et harum quidem rerum facilis est et expedita distinctio. Nam
              libero tempore, cum soluta nobis est eligendi optio cumque nihil
              impedit quo minus.
            </p>

            <p>
              Temporibus autem quibusdam et aut officiis debitis aut rerum
              necessitatibus saepe eveniet ut et voluptates repudiandae sint.
            </p>

            <h2
              className={`${dancingScript.className} text-3xl text-foreground inline-block pt-6`}
            >
              Badge Examples
            </h2>

            <p>
              Id quod maxime placeat facere possimus, omnis voluptas assumenda
              est, including{" "}
              <span className="inline-flex items-center">
                <Link
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge className="inline-flex gap-1 p-1 rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    Badge One
                  </Badge>
                </Link>
              </span>
              ,{" "}
              <span className="inline-flex items-center">
                <Link
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge className="inline-flex gap-1 p-1 rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    Badge Two
                  </Badge>
                </Link>
              </span>
              , and{" "}
              <span className="inline-flex items-center">
                <Link
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge className="inline-flex gap-1 p-1 rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    Badge Three
                  </Badge>
                </Link>
              </span>
              . Itaque earum rerum hic tenetur.
            </p>

            <h2
              className={`${dancingScript.className} text-3xl text-foreground inline-block pt-6`}
            >
              Interactive Components
            </h2>

            <h3
              className={cn("text-2xl font-semibold", dancingScript.className)}
            >
              Button Components
            </h3>

            <p>
              Sapiente delectus, ut aut reiciendis voluptatibus maiores alias
              consequatur aut perferendis doloribus asperiores repellat.
            </p>

            {/* Button Components Example */}
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="flex flex-col items-center space-y-6 py-6">
                <div className="flex flex-row justify-center gap-4 items-center">
                  <ActionButton />

                  <FavoriteButton />

                  <RefreshButton />
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Interactive button components example
                </p>
              </CardContent>
            </Card>

            <h3
              className={cn("text-2xl font-semibold", dancingScript.className)}
            >
              More Popovers
            </h3>

            <p>
              Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure
              reprehenderit qui in ea voluptate velit esse.{" "}
              <span>
                <HighlightPopover
                  triggerContent="Click for popover"
                  popoverTitle="Inline Popover"
                  popoverContent={
                    <span className="text-muted-foreground">
                      Nam libero tempore, cum soluta nobis est eligendi optio.
                    </span>
                  }
                />
              </span>{" "}
              Neque porro quisquam est.
            </p>

            <h2
              className={`${dancingScript.className} text-3xl text-foreground inline-block pt-6`}
            >
              Additional Examples
            </h2>

            <h3
              className={cn("text-2xl font-semibold", dancingScript.className)}
            >
              Nested Popovers
            </h3>

            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam.{" "}
              <HighlightPopover
                triggerContent="Popover with list"
                popoverTitle="List Inside Popover"
                popoverContent={
                  <p className="text-muted-foreground line-height">
                    <i>
                      Eaque ipsa quae ab illo inventore veritatis et quasi
                      architecto beatae vitae dicta sunt explicabo.
                    </i>
                  </p>
                }
              />
              ,{" "}
              <HighlightPopover
                triggerContent="Another popover"
                popoverTitle="Second Popover"
                popoverContent={
                  <p className="text-muted-foreground line-height">
                    <i>
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur.
                    </i>
                  </p>
                }
              />
              ,{" "}
              <HighlightPopover
                triggerContent="Third popover"
                popoverTitle="Third Example"
                popoverContent={
                  <p className="text-muted-foreground line-height">
                    <i>
                      Aut odit aut fugit, sed quia consequuntur magni dolores.
                    </i>
                  </p>
                }
              />
              ,{" "}
              <HighlightPopover
                triggerContent="Complex popover"
                popoverTitle="Complex Content"
                popoverContent={
                  <>
                    <p className="text-muted-foreground line-height">
                      "
                      <i>
                        Ut enim ad minima veniam, quis nostrum exercitationem
                        ullam corporis!
                      </i>
                    </p>
                    <p className="text-muted-foreground line-height">
                      View more at{" "}
                      <Link
                        className="text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://example.com"
                      >
                        example.com
                      </Link>
                    </p>
                  </>
                }
              />{" "}
              and more examples throughout.
            </p>

            <h3
              className={cn("text-2xl font-semibold", dancingScript.className)}
            >
              Final Section
            </h3>

            <p>
              Suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.{" "}
              <HighlightPopover
                triggerContent="Hover trigger"
                popoverTitle="Tooltip Style"
                popoverContent={
                  <p className="text-muted-foreground line-height">
                    Itaque earum rerum hic tenetur a sapiente delectus.
                  </p>
                }
              />{" "}
              understood better now.
            </p>

            <h3
              className={cn("text-2xl font-semibold", dancingScript.className)}
            >
              Date Example
            </h3>

            <p>
              Lorem ipsum dolor sit amet by
              <HighlightPopover
                direction="right"
                triggerContent=" January 1st"
                popoverTitle={
                  <h4 className="text-lg font-bold">Date Popover Example</h4>
                }
                popoverContent={
                  <p className="text-muted-foreground line-height">
                    Consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </p>
                }
              />
              , according to schedule.
            </p>

            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <h2
              className={`${dancingScript.className} text-3xl text-foreground inline-block pt-6`}
            >
              Conclusion
            </h2>

            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident.
            </p>

            <p>Lorem ipsum,</p>
            <span
              className={`${dancingScript.className} text-3xl text-foreground inline-block pt-6`}
            >
              Author Name
            </span>
          </div>
        </FramePanel>
        <FrameFooter>
          <p className="text-muted-foreground text-sm text-end">
            &copy; 2026 Lorem Ipsum
          </p>
        </FrameFooter>
      </Frame>
    </article>
  );
}
