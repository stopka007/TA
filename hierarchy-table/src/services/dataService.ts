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

  removeItem(itemId: string, parentKey?: string, itemIndex?: number): void {
    if (parentKey) {
      // Remove from children
      this.removeFromChildren(this.data, itemId, parentKey, itemIndex);
    } else {
      // Remove from root level - if we have an index, remove the specific item
      if (itemIndex !== undefined) {
        this.data.splice(itemIndex, 1);
      } else {
        // Fallback to removing by ID
        const index = this.data.findIndex(item => item.data.ID === itemId);
        if (index !== -1) {
          this.data.splice(index, 1);
        }
      }
    }
  }

  private removeFromChildren(items: HierarchyItem[], itemId: string, parentKey: string, itemIndex?: number): boolean {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Check if this item has the parent key in its children
      if (item.children[parentKey]) {
        const records = item.children[parentKey].records;
        const initialLength = records.length;
        
        // Remove the target item and all its children recursively
        if (itemIndex !== undefined) {
          // Remove the specific item at the given index
          if (itemIndex >= 0 && itemIndex < records.length) {
            const record = records[itemIndex];
            // Remove all children of this record first
            this.removeAllChildren(record);
            // Remove the record itself
            records.splice(itemIndex, 1);
            return true;
          }
        } else {
          // Fallback to removing by ID
          for (let j = records.length - 1; j >= 0; j--) {
            const record = records[j];
            if (record.data.ID === itemId) {
              // Remove all children of this record first
              this.removeAllChildren(record);
              // Remove the record itself
              records.splice(j, 1);
              return true;
            }
          }
        }
        
        // If we found and removed the item, return true
        if (records.length < initialLength) {
          return true;
        }
      }
      
      // Recursively search in all children
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

  // Helper method to get all column headers from the data
  getColumnHeaders(): string[] {
    const headers = new Set<string>();
    
    const extractHeaders = (items: HierarchyItem[]) => {
      items.forEach(item => {
        Object.keys(item.data).forEach(key => headers.add(key));
        Object.values(item.children).forEach(childGroup => {
          childGroup.records.forEach(record => {
            Object.keys(record.data).forEach(key => headers.add(key));
            extractHeaders([record]);
          });
        });
      });
    };
    
    extractHeaders(this.data);
    return Array.from(headers);
  }
}

export const dataService = new DataService(); 