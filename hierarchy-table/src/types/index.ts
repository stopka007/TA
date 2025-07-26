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

export interface HierarchyTableProps {
  data: HierarchyItem[];
} 