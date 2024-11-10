// data/candidates.ts

export interface Politician {
  name: string;
  age: number;
  sex: string;
  party: string;
}

export interface Candidate {
  id: number;
  president: Politician;
  vicePresident: Politician;
}

export interface PartyData {
  description: string;
  title: string;
  emoji: string;
  ctaText: string;
  ctaLink: string;
  content: string;
}

export const partyData: PartyData[] = [
  {
    description: "The Democratic Party",
    title: "Democrats",
    emoji: "🔵",
    ctaText: "Open",
    ctaLink: "https://democrats.org",
    content: "The Democratic Party, founded in 1828, is one of America's two major political parties. It generally supports progressive social policies, stronger environmental regulations, and a more active federal government role in addressing economic and social issues.\n\nKey positions include support for universal healthcare access, climate change action, gun control, and protecting civil rights. The party's base includes urban voters, minorities, young people, and college-educated professionals. Notable recent presidents include Barack Obama, Bill Clinton, and Joe Biden."
  },
  {
    description: "The Republican Party",
    title: "Republicans",
    emoji: "🔴",
    ctaText: "Open",
    ctaLink: "https://gop.com",
    content: "The Republican Party, founded in 1854, is America's other major political party. It generally advocates for conservative social values, free market economics, lower taxes, and limited government intervention.\n\nKey positions include support for Second Amendment rights, strong national defense, reduced government regulation, and traditional social values. The party's base includes rural voters, evangelical Christians, and business communities. Notable recent presidents include Donald Trump, George W. Bush, and Ronald Reagan."
  },
  {
    description: "The Green Party",
    title: "Green Party",
    emoji: "🌿",
    ctaText: "Open",
    ctaLink: "https://www.gp.org",
    content: "The Green Party is a progressive political party focused on environmental issues, social justice, and grassroots democracy. Founded in 2001, it advocates for radical action on climate change, universal healthcare, and economic reform.\n\nKey positions include support for the Green New Deal, peace and demilitarization, and electoral reform including ranked choice voting. While smaller than the major parties, it has influenced national dialogue on environmental and social issues."
  },
  {
    description: "The Libertarian Party",
    title: "Libertarians",
    emoji: "🗽",
    ctaText: "Open",
    ctaLink: "https://www.lp.org",
    content: "The Libertarian Party, founded in 1971, advocates for maximum individual liberty and minimal government intervention. It combines fiscal conservatism with social liberalism.\n\nKey positions include dramatic reduction of government size and spending, protection of civil liberties, free market capitalism, and non-interventionist foreign policy. While a third party, it often achieves significant ballot access and has influenced national discussions on individual rights and government power."
  },
  {
    description: "Independent Movement",
    title: "Independents",
    emoji: "⚖️",
    ctaText: "Open",
    ctaLink: "https://independentvoting.org",
    content: "Independent voters and candidates are not affiliated with any political party. This growing segment of American politics represents voters who prefer to evaluate issues and candidates on their individual merits rather than party loyalty.\n\nIndependent voters often play a crucial role in elections, particularly in swing states. Notable independent politicians have included Bernie Sanders (who caucuses with Democrats) and Angus King. The movement advocates for reduced partisanship and electoral reforms."
  },
];

export const PREDEFINED_CANDIDATES: Candidate[] = [
  { 
    id: 1, 
    president: { 
      name: "John Smith", 
      age: 55, 
      sex: "Male", 
      party: "Independent" 
    },
    vicePresident: { 
      name: "Sarah Parker", 
      age: 50, 
      sex: "Female", 
      party: "Independent" 
    },
  },
  { 
    id: 2, 
    president: { 
      name: "Jane Doe", 
      age: 48, 
      sex: "Female", 
      party: "Democratic" 
    },
    vicePresident: { 
      name: "Michael Chen", 
      age: 52, 
      sex: "Male", 
      party: "Democratic" 
    },
  },
  { 
    id: 3, 
    president: { 
      name: "Alice Johnson", 
      age: 60, 
      sex: "Female", 
      party: "Republican" 
    },
    vicePresident: { 
      name: "David Rodriguez", 
      age: 58, 
      sex: "Male", 
      party: "Republican" 
    },
  },
  { 
    id: 4, 
    president: { 
      name: "Bob Wilson", 
      age: 62, 
      sex: "Male", 
      party: "Green" 
    },
    vicePresident: { 
      name: "Maria Garcia", 
      age: 54, 
      sex: "Female", 
      party: "Green" 
    },
  },
  { 
    id: 5, 
    president: { 
      name: "Emily Davis", 
      age: 49, 
      sex: "Female", 
      party: "Libertarian" 
    },
    vicePresident: { 
      name: "James Thompson", 
      age: 53, 
      sex: "Male", 
      party: "Libertarian" 
    },
  },
  { 
    id: 6, 
    president: { 
      name: "Carlos Martinez", 
      age: 57, 
      sex: "Male", 
      party: "Socialist" 
    },
    vicePresident: { 
      name: "Linda Nguyen", 
      age: 51, 
      sex: "Female", 
      party: "Socialist" 
    },
  },
  { 
    id: 7, 
    president: { 
      name: "Sophia Lee", 
      age: 46, 
      sex: "Female", 
      party: "Progressive" 
    },
    vicePresident: { 
      name: "Ethan Brown", 
      age: 49, 
      sex: "Male", 
      party: "Progressive" 
    },
  },
  { 
    id: 8, 
    president: { 
      name: "William Harris", 
      age: 61, 
      sex: "Male", 
      party: "Constitution" 
    },
    vicePresident: { 
      name: "Olivia Clark", 
      age: 47, 
      sex: "Female", 
      party: "Constitution" 
    },
  },
];

export const electionInfo = {
  title: "2024 Presidential Election",
  description: `The presidential election is underway. Citizens are making their voices heard, choosing leaders who will shape our future. Every vote counts in this pivotal moment. Democracy in action, forging the path forward. Make your vote matter and influence the course of our nation.`,
};


