import React from 'react';
import { HierarchyItem } from '../types';

interface TableRowProps {
  item: HierarchyItem;
  level: number;
  onToggle: (itemId: string) => void;
  onRemove: (itemId: string, parentKey?: string, itemIndex?: number, parentId?: string) => void;
  expandedItems: Set<string>;
  columnHeaders: string[];
  isChild?: boolean;
  parentKey?: string;
  itemIndex?: number;
  parentId?: string;
}

const TableRow: React.FC<TableRowProps> = ({
  item,
  level,
  onToggle,
  onRemove,
  expandedItems,
  columnHeaders,
  isChild = false,
  parentKey,
  itemIndex,
  parentId
}) => {
  const itemId = item.data.ID;
  const isExpanded = expandedItems.has(itemId);
  const hasChildren = Object.keys(item.children).length > 0 && 
    Object.values(item.children).some(childGroup => childGroup.records.length > 0);

  const handleToggle = () => {
    if (hasChildren) {
      onToggle(itemId);
    }
  };

  const handleRemove = () => {
    onRemove(itemId, parentKey, itemIndex, parentId);
  };

  const getCellValue = (header: string): string => {
    return item.data[header] || '';
  };

  const getIndentationStyle = () => {
    if (level === 0) return {};
    return { paddingLeft: `${Math.min(level * 40, 200)}px` };
  };

  return (
    <>
      <tr className={`
        transition-colors duration-200 animate-fade-in
        ${level === 0 ? 'bg-dark-surface-3' : 
          level === 1 ? 'bg-dark-surface-2' : 
          level === 2 ? 'bg-gray-800' : 
          'bg-gray-900'}
        hover:bg-dark-hover
        
      `}>
        <td className="w-10 min-w-10 p-3 border-none align-middle text-center " style={getIndentationStyle()}>
          {hasChildren && (
            <button
              className={`
                border-none text-white cursor-pointer p-1 rounded transition-colors duration-200
                hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-teal-primary focus:ring-offset-2
                flex items-center justify-center w-6 h-6 bg-blue-500
               
              `}
              onClick={handleToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <span className="text-xs font-bold transition-transform duration-200">
                {isExpanded ? '▼' : '▶'}
              </span>
            </button>
          )}
        </td>
        {columnHeaders.map(header => (
          <td key={header} className="p-3 border-none align-middle max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
            <span className={`
              ${level === 0 ? 'font-semibold' : 
                level === 1 ? 'font-medium' : 
                'font-normal'}
            `}>
              {getCellValue(header)}
            </span>
          </td>
        ))}
        <td className="w-16 min-w-16 p-3 border-none align-middle text-center">
          <button
            className="
              bg-transparent border-none text-red-500 cursor-pointer p-1.5 rounded transition-all duration-200
              hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              flex items-center justify-center w-8 h-8 text-sm font-bold
            "
            onClick={handleRemove}
            aria-label="Remove item"
          >
            ✕
          </button>
        </td>
      </tr>
      
      {isExpanded && hasChildren && (
        <>
          {Object.entries(item.children).map(([childKey, childGroup]) => (
            <>
              {/* Nested header for this child group */}
              <tr className="bg-teal-primary text-white">
                <th className="w-10 min-w-10 p-2 text-left font-semibold border-none" style={{ paddingLeft: `${Math.min((level + 1) * 40, 200)}px` }}></th>
                {Object.keys(childGroup.records[0]?.data || {}).map(header => (
                  <th key={header} className="p-2 text-left font-semibold border-none text-sm">
                    {header}
                  </th>
                ))}
                <th className="w-16 min-w-16 p-2 text-left font-semibold border-none text-sm">delete</th>
              </tr>
              {/* Spacer row for visual separation */}
              <tr className="h-1 bg-transparent">
                <td colSpan={Object.keys(childGroup.records[0]?.data || {}).length + 2} className="p-0"></td>
              </tr>
              {childGroup.records.map((childRecord, childIndex) => (
                <TableRow
                  key={`${childRecord.data.ID}-${childIndex}`}
                  item={childRecord}
                  level={level + 1}
                  onToggle={onToggle}
                  onRemove={onRemove}
                  expandedItems={expandedItems}
                  columnHeaders={Object.keys(childRecord.data)}
                  isChild={true}
                  parentKey={childKey}
                  itemIndex={childIndex}
                  parentId={item.data.ID}
                />
              ))}
            </>
          ))}
        </>
      )}
    </>
  );
};

export default TableRow; 