export interface HierarchyItem {
  parent: HierarchyItem | null;
  children: HierarchyItem[] | null;

  refId: number;
  refUUID: string;
  refName: string;
  refType: string;
}
