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
  // Add more candidates as needed
];
