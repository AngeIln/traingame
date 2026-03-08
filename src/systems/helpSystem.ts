export interface TooltipDefinition {
  id: string;
  target: string;
  titleKey: string;
  bodyKey: string;
  showWhen?: string;
}

export interface GlossaryEntry {
  termKey: string;
  definitionKey: string;
  relatedKeys?: string[];
}

export const contextualTooltips: TooltipDefinition[] = [
  {
    id: "tooltip-profit-margin",
    target: "finance.profitMargin",
    titleKey: "help.tooltip.profitMargin.title",
    bodyKey: "help.tooltip.profitMargin.body",
  },
  {
    id: "tooltip-signal-density",
    target: "infrastructure.signalDensity",
    titleKey: "help.tooltip.signalDensity.title",
    bodyKey: "help.tooltip.signalDensity.body",
    showWhen: "playerLevel>=3",
  },
  {
    id: "tooltip-demand-forecast",
    target: "market.demandForecast",
    titleKey: "help.tooltip.demandForecast.title",
    bodyKey: "help.tooltip.demandForecast.body",
  },
];

export const glossaryEntries: GlossaryEntry[] = [
  {
    termKey: "help.glossary.term.headway",
    definitionKey: "help.glossary.definition.headway",
    relatedKeys: ["help.glossary.term.frequency"],
  },
  {
    termKey: "help.glossary.term.loadFactor",
    definitionKey: "help.glossary.definition.loadFactor",
    relatedKeys: ["help.glossary.term.capacity"],
  },
  {
    termKey: "help.glossary.term.operatingRatio",
    definitionKey: "help.glossary.definition.operatingRatio",
  },
];
