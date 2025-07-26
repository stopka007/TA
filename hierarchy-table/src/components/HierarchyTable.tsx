import React, { useState, useCallback } from 'react';
import { HierarchyItem, HierarchyTableProps } from '../types';
import TableRow from './TableRow';
import { dataService } from '../services/dataService';

const HierarchyTable: React.FC<HierarchyTableProps> = ({ data }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [tableData, setTableData] = useState<HierarchyItem[]>(data);

  const handleToggle = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const handleRemove = useCallback((itemId: string, parentKey?: string, itemIndex?: number) => {
    // Use the DataService to remove the item
    dataService.removeItem(itemId, parentKey, itemIndex);
    
    // Update local state to reflect the change
    setTableData(prevData => {
      // Get the updated data from the service
      return [...dataService.getData()];
    });
  }, []);

  // Get all unique column headers
  const getColumnHeaders = (): string[] => {
    const headers = new Set<string>();
    
    const extractHeaders = (items: HierarchyItem[]) => {
      if (!items || items.length === 0) return;
      
      items.forEach(item => {
        if (item.data) {
          Object.keys(item.data).forEach(key => headers.add(key));
        }
        if (item.children) {
          Object.values(item.children).forEach(childGroup => {
            if (childGroup && childGroup.records) {
              childGroup.records.forEach(record => {
                if (record.data) {
                  Object.keys(record.data).forEach(key => headers.add(key));
                }
                extractHeaders([record]);
              });
            }
          });
        }
      });
    };
    
    extractHeaders(tableData);
    return Array.from(headers);
  };

  const columnHeaders = getColumnHeaders();

  if (!tableData || tableData.length === 0) {
    return (
      <div className="bg-dark-surface text-white font-sans p-5 rounded-lg overflow-x-auto scrollbar-thin">
        <div className="text-center py-10 text-gray-300 text-lg">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface text-white font-sans p-5 rounded-lg overflow-x-auto scrollbar-thin">
      <table className="w-full border-collapse bg-dark-surface text-white text-sm min-w-[1200px]">
        <thead>
          <tr className="bg-teal-primary text-white">
            <th className="w-10 min-w-10 p-3 text-left font-semibold border-none sticky top-0 z-10 text-center"></th>
            {columnHeaders.map(header => (
              <th key={header} className="p-3 text-left font-semibold border-none sticky top-0 z-10">
                {header}
              </th>
            ))}
            <th className="w-16 min-w-16 p-3 text-left font-semibold border-none sticky top-0 z-10 text-center">delete</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <TableRow
              key={`${item.data.ID}-${index}`}
              item={item}
              level={0}
              onToggle={handleToggle}
              onRemove={handleRemove}
              expandedItems={expandedItems}
              columnHeaders={columnHeaders}
              itemIndex={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HierarchyTable; 