// Preview data. Real runs and incident state will come from persistence in later features.
export type DemoProject = {
  name: string;
  repository: string;
  journeys: number;
  status: "healthy" | "incident";
  checkedAt: string;
};

export const projects: DemoProject[] = [
  {
    name: "JDM Engenharia",
    repository: "mrJoao28/JDM-Landing-Page",
    journeys: 3,
    status: "incident",
    checkedAt: "há 2 min",
  },
  {
    name: "Brasil Data API",
    repository: "mrJoao28/Brasil-Data-API",
    journeys: 2,
    status: "healthy",
    checkedAt: "há 4 min",
  },
  {
    name: "Financial",
    repository: "mrJoao28/financial",
    journeys: 3,
    status: "healthy",
    checkedAt: "há 7 min",
  },
];
