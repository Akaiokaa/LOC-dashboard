export function mergeRecordsWithPayees(records, payees) {
  // Step 1: Group records by assessment_id
  const grouped = Object.values(
    records.reduce((acc, row) => {
      const key = row.assessment_id;

      if (!acc[key]) {
        acc[key] = {
          ...row,
          payee_ids: [],
          amounts: [],
        };
      }

      acc[key].payee_ids.push(row.payee_id);
      acc[key].amounts.push(parseFloat(row.amount));

      return acc;
    }, {})
  );

  // Step 2: Convert payee_ids to names and sum amounts
  const merged = grouped.map((item) => {
    const names = item.payee_ids
      .map((id) => payees.find((p) => p.payee_id === id)?.payee_name)
      .filter(Boolean)
      .join(", ");

    const total_amount = item.amounts.reduce((sum, n) => sum + n, 0).toFixed(2);

    // Remove temporary arrays and include final fields
    const { payee_ids, amounts, amount, payee_id, ...rest } = item;
    return {
      ...rest,
      payees: names,
      total_amount,
    };
  });

  return merged;
}
