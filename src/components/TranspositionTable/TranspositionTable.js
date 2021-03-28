import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable, useGlobalFilter, useAsyncDebounce } from "react-table";
import "./style.module.scss";

const columns = [
  {
    Header: "zobrist",
    accessor: "zobrist",
  },
  {
    Header: "value",
    accessor: "value",
  },
  {
    Header: "flag",
    accessor: "flag",
  },
  {
    Header: "depth",
    accessor: "depth",
  },
  {
    Header: "best_move",
    accessor: "best_move",
  },
  {
    Header: "age",
    accessor: "age",
  },
];

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
  );
}

const TranspositionTable = () => {
  const [data, setData] = useState([]);

  useEffect(async () => {
    const result = await axios.get("http://localhost:5000/transposition_table");

    setData(result.data);
  }, []);

  if (!data) return <div>Loading...</div>;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter
  );

  const firstPageRows = rows.slice(0, 10);

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TranspositionTable;
