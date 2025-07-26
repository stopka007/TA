import { HierarchyItem } from '../types';

class DataService {
  private data: HierarchyItem[] = [];

  async loadData(): Promise<HierarchyItem[]> {
    try {
      const response = await fetch('/example-data.json');
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error loading data:', error);
      return [];
    }
  }

  getData(): HierarchyItem[] {
    return this.data;
  }

  removeItem(itemId: string, parentKey?: string, itemIndex?: number, parentId?: string): void {
    if (parentKey) {
      // For children, find the specific parent and remove from it
      if (parentId) {
        this.removeFromSpecificParent(this.data, itemId, parentKey, parentId, itemIndex);
      } else {
        this.removeFromChildren(this.data, itemId, parentKey, itemIndex);
      }
    } else {
      if (itemIndex !== undefined) {
        this.data.splice(itemIndex, 1);
      } else {
        const index = this.data.findIndex(item => item.data.ID === itemId);
        if (index !== -1) {
          this.data.splice(index, 1);
        }
      }
    }
  }

  private removeFromSpecificParent(items: HierarchyItem[], itemId: string, parentKey: string, parentId: string, itemIndex?: number): boolean {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.data.ID === parentId) {
        // Found the target parent, remove the child from it
        if (item.children[parentKey]) {
          const records = item.children[parentKey].records;
          
          if (itemIndex !== undefined) {
            if (itemIndex >= 0 && itemIndex < records.length) {
              const record = records[itemIndex];
              this.removeAllChildren(record);
              records.splice(itemIndex, 1);
              return true;
            }
          } else {
            for (let j = records.length - 1; j >= 0; j--) {
              const record = records[j];
              if (record.data.ID === itemId) {
                this.removeAllChildren(record);
                records.splice(j, 1);
                return true;
              }
            }
          }
        }
        return false;
      }
      
      // Search in this item's children for the target parent
      for (const childKey in item.children) {
                 if (this.removeFromSpecificParent(item.children[childKey].records, itemId, parentKey, parentId, itemIndex)) {
          return true;
        }
      }
    }
    
    return false;
  }

  private removeFromChildren(items: HierarchyItem[], itemId: string, parentKey: string, itemIndex?: number): boolean {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.children[parentKey]) {
        const records = item.children[parentKey].records;
        const initialLength = records.length;
        
        if (itemIndex !== undefined) {
          if (itemIndex >= 0 && itemIndex < records.length) {
            const record = records[itemIndex];
            this.removeAllChildren(record);
            records.splice(itemIndex, 1);
            return true;
          }
        } else {
          for (let j = records.length - 1; j >= 0; j--) {
            const record = records[j];
            if (record.data.ID === itemId) {
              this.removeAllChildren(record);
              records.splice(j, 1);
              return true;
            }
          }
        }
        
        if (records.length < initialLength) {
          return true;
        }
      }
      
      // Search deeper if we haven't found the item yet
      for (const childKey in item.children) {
        if (this.removeFromChildren(item.children[childKey].records, itemId, parentKey, itemIndex)) {
          return true;
        }
      }
    }
    
    return false;
  }

  private removeAllChildren(record: any): void {
    for (const childKey in record.children) {
      record.children[childKey].records = [];
    }
  }

  getColumnHeaders(): string[] {
    const headers = new Set<string>();
    
    // Only get headers from root level data
    this.data.forEach(item => {
      Object.keys(item.data).forEach(key => headers.add(key));
    });
    
    return Array.from(headers);
  }
}

export const dataService = new DataService(); 