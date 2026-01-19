const scenarios = [
  {
    id: 1,
    text: "A stranger offers to help you bypass a long security queue using their access card.",
    trustImpact: +10,
    trapImpact: -15
  },
  {
    id: 2,
    text: "Your teammate asks for your login credentials to fix an urgent production issue.",
    trustImpact: -20,
    trapImpact: +10
  },
  {
    id: 3,
    text: "An unknown email claims you won a reward and asks you to verify your identity.",
    trustImpact: -15,
    trapImpact: +10
  },
  {
    id: 4,
    text: "A friend asks you to invest money in a project they haven't explained fully.",
    trustImpact: +5,
    trapImpact: -10
  },
  {
    id: 5,
    text: "A company offers you a job without an interview but asks for upfront registration fees.",
    trustImpact: -25,
    trapImpact: +15
  }
];

module.exports = scenarios;
