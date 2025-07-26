export interface DataItem {
  [key: string]: string;
}

export interface ChildRecord {
  data: DataItem;
  children: ChildrenData;
}

export interface ChildrenData {
  [key: string]: {
    records: ChildRecord[];
  };
}

export interface HierarchyItem {
  data: DataItem;
  children: ChildrenData;
}

export interface TableRowProps {
  item: HierarchyItem;
  level: number;
  onToggle: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  expandedItems: Set<string>;
  isChild?: boolean;
  parentKey?: string;
}

export interface HierarchyTableProps {
  data: HierarchyItem[];
} 