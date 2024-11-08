import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

export function PartySection() {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-bold text-gray-100 mb-4">Learn About the Parties Running</h1>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.05 },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <div className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg flex items-center justify-center text-6xl bg-gray-100">
                  {active.emoji}
                </div>
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="w-full gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <div className="h-40 w-40 md:h-14 md:w-14 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                  {card.emoji}
                </div>
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.05 },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
const cards = [
  {
    description: "The Democratic Party",
    title: "Democrats",
    emoji: "🔵",
    ctaText: "Open",
    ctaLink: "https://democrats.org",
    content: () => {
      return (
        <p>
          The Democratic Party, founded in 1828, is one of America's two major political parties. It generally supports progressive social policies, stronger environmental regulations, and a more active federal government role in addressing economic and social issues. <br /> <br />
          Key positions include support for universal healthcare access, climate change action, gun control, and protecting civil rights. The party's base includes urban voters, minorities, young people, and college-educated professionals. Notable recent presidents include Barack Obama, Bill Clinton, and Joe Biden.
        </p>
      );
    },
  },
  {
    description: "The Republican Party",
    title: "Republicans",
    emoji: "🔴",
    ctaText: "Open",
    ctaLink: "https://gop.com",
    content: () => {
      return (
        <p>
          The Republican Party, founded in 1854, is America's other major political party. It generally advocates for conservative social values, free market economics, lower taxes, and limited government intervention. <br /> <br />
          Key positions include support for Second Amendment rights, strong national defense, reduced government regulation, and traditional social values. The party's base includes rural voters, evangelical Christians, and business communities. Notable recent presidents include Donald Trump, George W. Bush, and Ronald Reagan.
        </p>
      );
    },
  },
  {
    description: "The Green Party",
    title: "Green Party",
    emoji: "🌿",
    ctaText: "Open",
    ctaLink: "https://www.gp.org",
    content: () => {
      return (
        <p>
          The Green Party is a progressive political party focused on environmental issues, social justice, and grassroots democracy. Founded in 2001, it advocates for radical action on climate change, universal healthcare, and economic reform. <br /> <br />
          Key positions include support for the Green New Deal, peace and demilitarization, and electoral reform including ranked choice voting. While smaller than the major parties, it has influenced national dialogue on environmental and social issues.
        </p>
      );
    },
  },
  {
    description: "The Libertarian Party",
    title: "Libertarians",
    emoji: "🗽",
    ctaText: "Open",
    ctaLink: "https://www.lp.org",
    content: () => {
      return (
        <p>
          The Libertarian Party, founded in 1971, advocates for maximum individual liberty and minimal government intervention. It combines fiscal conservatism with social liberalism. <br /> <br />
          Key positions include dramatic reduction of government size and spending, protection of civil liberties, free market capitalism, and non-interventionist foreign policy. While a third party, it often achieves significant ballot access and has influenced national discussions on individual rights and government power.
        </p>
      );
    },
  },
  {
    description: "Independent Movement",
    title: "Independents",
    emoji: "⚖️",
    ctaText: "Open",
    ctaLink: "https://independentvoting.org",
    content: () => {
      return (
        <p>
          Independent voters and candidates are not affiliated with any political party. This growing segment of American politics represents voters who prefer to evaluate issues and candidates on their individual merits rather than party loyalty. <br /> <br />
          Independent voters often play a crucial role in elections, particularly in swing states. Notable independent politicians have included Bernie Sanders (who caucuses with Democrats) and Angus King. The movement advocates for reduced partisanship and electoral reforms.
        </p>
      );
    },
  },
];