export interface View {
  render?(data: unknown): void;
  getElement?(): HTMLDivElement;
  destroy?(): void;
}
