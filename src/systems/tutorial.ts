export interface TutorialStep {
  id: string;
  titleKey: string;
  descriptionKey: string;
  completionCondition: string;
  rewardHintKey?: string;
}

/**
 * Tutoriel guidé: emmène le joueur vers sa première ligne rentable en 10 étapes.
 */
export const firstProfitableLineTutorial: TutorialStep[] = [
  {
    id: "step-01-open-map",
    titleKey: "tutorial.step01.title",
    descriptionKey: "tutorial.step01.description",
    completionCondition: "mapOpened",
  },
  {
    id: "step-02-choose-cities",
    titleKey: "tutorial.step02.title",
    descriptionKey: "tutorial.step02.description",
    completionCondition: "twoCitiesSelected",
  },
  {
    id: "step-03-lay-track",
    titleKey: "tutorial.step03.title",
    descriptionKey: "tutorial.step03.description",
    completionCondition: "trackBuilt",
  },
  {
    id: "step-04-buy-train",
    titleKey: "tutorial.step04.title",
    descriptionKey: "tutorial.step04.description",
    completionCondition: "trainPurchased",
  },
  {
    id: "step-05-create-line",
    titleKey: "tutorial.step05.title",
    descriptionKey: "tutorial.step05.description",
    completionCondition: "lineCreated",
  },
  {
    id: "step-06-set-schedule",
    titleKey: "tutorial.step06.title",
    descriptionKey: "tutorial.step06.description",
    completionCondition: "scheduleConfigured",
  },
  {
    id: "step-07-start-service",
    titleKey: "tutorial.step07.title",
    descriptionKey: "tutorial.step07.description",
    completionCondition: "lineStarted",
  },
  {
    id: "step-08-monitor-demand",
    titleKey: "tutorial.step08.title",
    descriptionKey: "tutorial.step08.description",
    completionCondition: "demandPanelOpened",
  },
  {
    id: "step-09-tune-pricing",
    titleKey: "tutorial.step09.title",
    descriptionKey: "tutorial.step09.description",
    completionCondition: "ticketPriceAdjusted",
  },
  {
    id: "step-10-reach-profit",
    titleKey: "tutorial.step10.title",
    descriptionKey: "tutorial.step10.description",
    completionCondition: "lineProfitPositive",
    rewardHintKey: "tutorial.step10.reward",
  },
];
