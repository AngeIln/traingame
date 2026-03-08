export type TextScale = "small" | "medium" | "large" | "x-large";
export type ContrastMode = "default" | "high";
export type ColorVisionMode = "normal" | "protanopia" | "deuteranopia" | "tritanopia";

export interface AccessibilityOptions {
  textScale: TextScale;
  contrastMode: ContrastMode;
  colorVisionMode: ColorVisionMode;
}

export const defaultAccessibilityOptions: AccessibilityOptions = {
  textScale: "medium",
  contrastMode: "default",
  colorVisionMode: "normal",
};

export const accessibilityClassMap = {
  textScale: {
    small: "a11y-text-small",
    medium: "a11y-text-medium",
    large: "a11y-text-large",
    "x-large": "a11y-text-x-large",
  },
  contrastMode: {
    default: "a11y-contrast-default",
    high: "a11y-contrast-high",
  },
  colorVisionMode: {
    normal: "a11y-color-normal",
    protanopia: "a11y-color-protanopia",
    deuteranopia: "a11y-color-deuteranopia",
    tritanopia: "a11y-color-tritanopia",
  },
} as const;
