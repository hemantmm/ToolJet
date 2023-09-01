import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { TooljetDatabaseContext } from '@/TooljetDatabase/index';
import DropDownSelect from './DropDownSelect';

export default function JoinSelect({ darkMode }) {
  const { joinOptions, tableInfo, setJoinSelectOptions, joinSelectOptions } = useContext(TooljetDatabaseContext);

  const tableSet = new Set();
  (joinOptions || []).forEach((join) => {
    const { table, conditions } = join;
    tableSet.add(table);
    conditions?.conditionsList?.forEach((condition) => {
      const { leftField, rightField } = condition;
      if (leftField?.table) {
        tableSet.add(leftField?.table);
      }
      if (rightField?.table) {
        tableSet.add(rightField?.table);
      }
    });
  });

  const tables = [...tableSet];
  const tableOptions = {};
  for (let index = 0; index < tables.length; index++) {
    const table = tables[index];
    tableOptions[table] = (tableInfo[table] || []).map((column) => ({ label: column.Header, value: column.Header }));
  }

  // When column name are same, alias has been added
  const handleChange = (columns, table) => {
    const unchangedSelectFields = joinSelectOptions.filter((t) => t.table !== table);
    let newSelectFields = [...unchangedSelectFields, ...columns.map((column) => ({ name: column?.value, table }))];
    newSelectFields = newSelectFields.map((field) => {
      if (newSelectFields.filter(({ name }) => name === field.name).length > 1 && !('alias' in field)) {
        return {
          ...field,
          alias: field.table + '_' + field.name,
        };
      }
      return field;
    });
    setJoinSelectOptions(newSelectFields);
  };

  return (
    <Container className="p-0">
      {tables.map((table) => (
        <Row key={table} className="border rounded mb-2">
          <Col sm="3" className="p-0 border-end">
            <div className="tj-small-btn px-2">{table}</div>
          </Col>
          <Col sm="9" className="p-0 border-end">
            <DropDownSelect
              options={tableOptions[table]}
              darkMode={darkMode}
              isMulti
              onChange={(values) => handleChange(values, table)}
              value={joinSelectOptions
                .filter((val) => val?.table === table)
                .map((column) => ({ value: column?.name, label: column?.name }))}
              // value=''
            />
          </Col>
        </Row>
      ))}
    </Container>
  );
}