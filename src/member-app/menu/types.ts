export type MenuBlock = "短距離" | "短長距離" | "跳躍";
export type MenuCategory = "アップ" | "本練習" | "補強" | "専門";

export const CATEGORIES: MenuCategory[] = ["アップ", "本練習", "補強", "専門"];

export type OptionPart =
  | { kind: "fixed"; text: string }
  | { kind: "multicheck"; options: string[]; separator?: string }
  | { kind: "number"; prefix?: string; suffix: string }
  | { kind: "select"; options: string[] };

export type TemplateSpec = { parts: OptionPart[] };

export type CustomOption = { id: string; label: string; selected: boolean };

export type MenuItem = {
  id: string;
  title: string;
  checked: boolean;
  note: string;
  isCustom: boolean;
  category: MenuCategory;
  customOptions?: CustomOption[];
};

export type DailyMenu = {
  date: string;
  items: MenuItem[];
  teacherNote: string;
  updatedBy: string;
  updatedAt: string;
};

export const TEMPLATES: {
  title: string;
  category: MenuCategory;
  spec?: TemplateSpec;
}[] = [
  {
    title: "チューブ",
    category: "アップ",
    spec: { parts: [{ kind: "multicheck", options: ["足踏み", "前"] }] },
  },
  { title: "動き作り", category: "アップ" },
  { title: "マークドリル", category: "アップ" },
  { title: "ハードルドリル", category: "アップ" },
  { title: "動的&倒立&体幹", category: "アップ" },
  {
    title: "アクティベーションドリル（18種）",
    category: "アップ",
    spec: { parts: [{ kind: "number", suffix: "セット" }] },
  },
  {
    title: "10種目アップ",
    category: "アップ",
    spec: { parts: [{ kind: "fixed", text: "のうち5種目" }] },
  },
  {
    title: "並走バトン",
    category: "本練習",
    spec: {
      parts: [
        { kind: "fixed", text: "前後左右" },
        { kind: "number", suffix: "本づつ" },
      ],
    },
  },
  {
    title: "200m",
    category: "本練習",
    spec: { parts: [{ kind: "number", suffix: "セット" }] },
  },
  {
    title: "150m",
    category: "本練習",
    spec: {
      parts: [
        { kind: "number", suffix: "本" },
        { kind: "number", suffix: "セット" },
      ],
    },
  },
  {
    title: "120m",
    category: "本練習",
    spec: {
      parts: [
        { kind: "number", suffix: "本" },
        { kind: "number", suffix: "セット" },
      ],
    },
  },
  {
    title: "スタブロ",
    category: "本練習",
    spec: {
      parts: [
        { kind: "multicheck", options: ["30", "60", "80"], separator: "・" },
      ],
    },
  },
  {
    title: "台ドロップ",
    category: "本練習",
    spec: {
      parts: [
        { kind: "select", options: ["1.2", "1.5", "1.2・1.5"] },
        { kind: "number", prefix: "各脚ゆっくり", suffix: "本" },
        { kind: "number", prefix: "片足台の上で早く,各脚", suffix: "本" },
      ],
    },
  },
  {
    title: "5分間腹筋",
    category: "補強",
    spec: { parts: [{ kind: "number", suffix: "セット" }] },
  },
  {
    title: "腿上げ&補強10分",
    category: "補強",
    spec: { parts: [{ kind: "number", suffix: "セット" }] },
  },
  { title: "専門", category: "専門" },
  { title: "短距離", category: "専門" },
  { title: "中長距離", category: "専門" },
  { title: "跳躍", category: "専門" },
];

export const TEMPLATE_SPECS: Record<string, TemplateSpec> = Object.fromEntries(
  TEMPLATES.filter((t) => t.spec).map((t) => [t.title, t.spec!]),
);
