import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

export default function ResultTable({ columns, data, className, id}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div id={id} className={className}>
      {/* border-separate needed so border moves with sticky headers: https://stackoverflow.com/questions/50361698/border-style-do-not-work-with-sticky-position-element */}
      <table className="border-separate border-spacing-0">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id} className="">
            {/* top-8 puts headers below the tabs, which is necessary since sticky is relative to nearest scrollable parent, which is the same for the tab */}
            {headerGroup.headers.map(header => (
              <th key={header.id} className="z-10 font-semibold border border-gray-700 p-2 sticky bg-gray-50 top-8 text-gray-700">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="">
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className="hover:bg-gray-100">
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="border border-gray-700 p-1 text-gray-700">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map(footerGroup => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  </div>
  ) 
}