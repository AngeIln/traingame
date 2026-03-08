export type SaveType = "auto" | "manual";

export interface SaveMetadata {
  gameVersion: string;
  mapSeed: string;
  playTimeMinutes: number;
  cash: number;
  companyName: string;
  profitableLines: number;
  note?: string;
}

export interface SaveSlot {
  id: string;
  slotName: string;
  updatedAt: string;
  saveType: SaveType;
  metadata: SaveMetadata;
  payload: string;
}

export interface SavePolicy {
  autoSaveIntervalMs: number;
  maxAutoSlots: number;
  maxManualSlots: number;
}

export const defaultSavePolicy: SavePolicy = {
  autoSaveIntervalMs: 120_000,
  maxAutoSlots: 3,
  maxManualSlots: 8,
};

/**
 * Fournit une API simple pour gérer des sauvegardes manuelles + auto,
 * avec slots nommés et métadonnées.
 */
export class SaveSystem {
  private readonly policy: SavePolicy;
  private slots: SaveSlot[] = [];

  constructor(policy: SavePolicy = defaultSavePolicy) {
    this.policy = policy;
  }

  public createSave(input: Omit<SaveSlot, "id" | "updatedAt">): SaveSlot {
    const next: SaveSlot = {
      ...input,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };

    this.slots = this.pruneByPolicy([...this.slots, next], next.saveType);
    return next;
  }

  public listSaves(): SaveSlot[] {
    return [...this.slots].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  public renameSlot(saveId: string, slotName: string): void {
    this.slots = this.slots.map((slot) =>
      slot.id === saveId
        ? {
            ...slot,
            slotName,
            updatedAt: new Date().toISOString(),
          }
        : slot,
    );
  }

  public deleteSave(saveId: string): void {
    this.slots = this.slots.filter((slot) => slot.id !== saveId);
  }

  private pruneByPolicy(slots: SaveSlot[], type: SaveType): SaveSlot[] {
    const cap = type === "auto" ? this.policy.maxAutoSlots : this.policy.maxManualSlots;

    const selectedType = slots
      .filter((s) => s.saveType === type)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, cap)
      .map((s) => s.id);

    return slots.filter((slot) => slot.saveType !== type || selectedType.includes(slot.id));
  }
}
