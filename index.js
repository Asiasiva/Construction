import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ConstructionExpenseTracker() {
  const [siteName, setSiteName] = useState('');
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [incomeInputs, setIncomeInputs] = useState({ project: '', advance: '', stage: '', other: '' });
  const [expenseInputs, setExpenseInputs] = useState({ type: '', typeInput: '', subType: '', amount: '', vendor: '', mode: '' });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const addIncome = () => {
    setIncomeList([...incomeList, { ...incomeInputs, siteName, date }]);
    setIncomeInputs({ project: '', advance: '', stage: '', other: '' });
  };

  const addExpense = () => {
    const finalType = expenseInputs.typeInput || expenseInputs.type;
    setExpenseList([...expenseList, { ...expenseInputs, type: finalType, siteName, date }]);
    setExpenseInputs({ type: '', typeInput: '', subType: '', amount: '', vendor: '', mode: '' });
  };

  const deleteIncome = (index) => setIncomeList(incomeList.filter((_, i) => i !== index));
  const deleteExpense = (index) => setExpenseList(expenseList.filter((_, i) => i !== index));

  const totalIncome = incomeList.reduce((acc, curr) => acc + Number(curr.advance || 0) + Number(curr.stage || 0) + Number(curr.other || 0), 0);
  const totalExpense = expenseList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const expenseTypes = [
    'Material', 'Labour', 'Machine Rent', 'Transport', 'Fuel', 'Loading / Unloading', 'Electrician Work',
    'Plumbing Work', 'Painter', 'Carpenter', 'Fabrication', 'Site Expenses', 'Water Tanker', 'EB Bill',
    'Security Salary', 'Consultancy Fees', 'Approval Fees', 'Miscellaneous'
  ];

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const incomeWS = XLSX.utils.json_to_sheet(incomeList);
    const expenseWS = XLSX.utils.json_to_sheet(expenseList);
    XLSX.utils.book_append_sheet(wb, incomeWS, 'Income');
    XLSX.utils.book_append_sheet(wb, expenseWS, 'Expenses');
    const fileName = `${siteName || 'Site'}_${new Date().toISOString().split('T')[0]}_Report.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Construction Expense & Income Tracker</h1>
        <p className="text-gray-600 mt-2">Professional Monitoring System</p>
        <div className="mt-4 flex justify-center gap-4">
          <input value={siteName} onChange={e => setSiteName(e.target.value)} className="w-1/3 p-3 border rounded-xl" placeholder="Site Name" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-1/3 p-3 border rounded-xl" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Income Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Income (வரவு)</h2>
          <div className="space-y-4">
            <input value={incomeInputs.project} onChange={e => setIncomeInputs({ ...incomeInputs, project: e.target.value })} className="w-full p-3 border rounded-xl" placeholder="Project / Client Name" />
            <input value={incomeInputs.advance} onChange={e => setIncomeInputs({ ...incomeInputs, advance: e.target.value })} className="w-full p-3 border rounded-xl" placeholder="Advance Payment" />
            <input value={incomeInputs.stage} onChange={e => setIncomeInputs({ ...incomeInputs, stage: e.target.value })} className="w-full p-3 border rounded-xl" placeholder="Stage-wise Payment" />
            <input value={incomeInputs.other} onChange={e => setIncomeInputs({ ...incomeInputs, other: e.target.value })} className="w-full p-3 border rounded-xl" placeholder="Other Income" />
            <button onClick={addIncome} className="w-full bg-green-600 text-white p-3 rounded-xl">Add Income</button>
          </div>
          <div className="mt-4">
            {incomeList.map((income, i) => (
              <div key={i} className="flex justify-between items-center p-2 border-b">
                <span>{income.siteName} | {income.date} | {income.project} - ₹{Number(income.advance || 0) + Number(income.stage || 0) + Number(income.other || 0)}</span>
                <button onClick={() => deleteIncome(i)} className="text-red-600">Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Expenses (செலவு)</h2>
          <div className="space-y-4">
            <select value={expenseInputs.type} onChange={e => setExpenseInputs({ ...expenseInputs, type: e.target.value })} className="w-full p-3 border rounded-xl">
              <option value="">Select Expense Type</option>
              {expenseTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            <input value={expenseInputs.typeInput} onChange={e => setExpenseInputs({ ...expenseInputs, typeInput: e.target.value })} className="w-full p-3 border rounded-xl" placeholder="Or Enter Expense Type" />
            <input value={expenseInputs.subType} onChange={e => setExpenseInputs({ ...expenseInputs, subType: e.target.value })} className="w-full p-3 border rounded-xl" placeholder="Sub Category" />
            <input value={expenseInputs.amount} onChange={e => setExpenseInputs({ ...expenseInputs, amount: e.target.value })} className="w-full p-3 border rounded-xl" placeholder="Amount" />
            <input value={expenseInputs.vendor} onChange={e => setExpenseInputs({ ...expenseInputs, vendor: e.target.value })} className="w-full p-3 border rounded-xl" placeholder="Vendor Name / Bill No" />
            <select value={expenseInputs.mode} onChange={e => setExpenseInputs({ ...expenseInputs, mode: e.target.value })} className="w-full p-3 border rounded-xl">
              <option value="">Select Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
            </select>
            <button onClick={addExpense} className="w-full bg-red-600 text-white p-3 rounded-xl">Add Expense</button>
          </div>
          <div className="mt-4">
            {expenseList.map((expense, i) => (
              <div key={i} className="flex justify-between items-center p-2 border-b">
                <span>{expense.siteName} | {expense.date} | {expense.type} - {expense.subType} - ₹{expense.amount}</span>
                <button onClick={() => deleteExpense(i)} className="text-red-600">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={exportToExcel} className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow">Export to Excel</button>
      </div>
    </div>
  );
}
