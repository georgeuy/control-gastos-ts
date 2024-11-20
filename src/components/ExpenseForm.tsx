import { categories } from "../data/categories"

import DatePicker from 'react-date-picker'
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { DraftExpense, Value } from "../types"
import ErrorMessage from "./ErrorMessage"
import { useBudget } from "../hooks/useBudget"


export default function ExpenseForm() {

  // hooks

  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: '',
    category:'',
    date: new Date()
  })

  const [error, setError] = useState('')

  const [previousAmount, setPreviousAmount] = useState(0)
  
  const { dispatch, state, remainingBudget } = useBudget()

  useEffect(() => {

    if(state.editingId){
      const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
      setExpense(editingExpense)
      setPreviousAmount(editingExpense.amount)
    }

  },[state.editingId])


  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    const isAmountField = ['amount'].includes(name)
    
    setExpense({
      ...expense,
      [name]: isAmountField ? +value : value
    })
    
  }

  const handleChangeDate = (value:Value) => {
      setExpense({
        ...expense,
        date: value
      })
  }

  const handlesubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // validation one
    if(Object.values(expense).includes('')){
      setError('Todos los campos son obligatorios')
      return
    }

    // validate remaining budget available
    if(  (expense.amount - previousAmount) > remainingBudget ){
      setError('No hay plata!!!')
      return
    }

    setError('')

    // Guardar o actualizar el gasto
    if(state.editingId){
      dispatch({
        type:'uptade-expense',
        payload: {expense: {...expense, id: state.editingId}}
      })
    }else{
      dispatch({
        type: 'add-expense',
        payload: {draftExpense: expense}
      })
    }

    // Reiniciar el state
    setExpense({
      amount:0,
      expenseName:'',
      category:'',
      date: new Date()
    })

    setPreviousAmount(0)

  }

  const isEditing = useMemo(() => state.editingId ? true : false ,[state.editingId]) 

  return (
    <form onSubmit={handlesubmit} className="space-y-4">
      <legend
        className=" uppercase text-2xl text-center font-black border-b-4 border-blue-500 py-2"
      >{isEditing ? 'Actualizar Gasto' : 'Nuevo Gasto'}</legend>

      {error && <ErrorMessage>{error}</ErrorMessage> }

      <div className="flex flex-col gap-2">
        
          <label htmlFor="expenseName"
            className="text-xl"
          >Nombre del Gasto</label>

          <input 
            type="text" 
            id="expenseName"
            placeholder="Nombre del gasto"
            className="bg-slate-100 p-2"
            name="expenseName"
            value={expense.expenseName}
            onChange={handleChange}
          />

      </div>

      <div className="flex flex-col gap-2">
        
          <label htmlFor="amount"
            className="text-xl">Cantidad</label>

          <input 
            type="number" 
            id="amount"
            placeholder="Cantidad del gasto"
            className="bg-slate-100 p-2"
            name="amount"
            onChange={handleChange}
            value={expense.amount}
          />

      </div>

      <div className="flex flex-col gap-2">
        
          <label htmlFor="category"
            className="text-xl">Categoría</label>

          <select 
            id="category"
            className="bg-slate-100 p-2"
            name="category"
            onChange={handleChange}
            value={expense.category}
          >
            <option value="">-- Seleccione --</option>
            {categories.map(category => (
              <option 
                key = {category.id}
                value = {category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

      </div>

      <div className="flex flex-col gap-2">
        
        <label htmlFor="amountDate"
          className="text-xl">Fecha del Gasto</label>

        <DatePicker 
          className="bg-slate-100 p-2 border-0"
          value={expense.date}
          onChange={handleChangeDate}
        />

    </div>
    
      <input 
        type="submit"
        className="uppercase bg-blue-600 cursor-pointer w-full p-2 text-white text-center font-bold rounded-lg"
        value={isEditing ? "Guardar Cambios" : "Registrar Gasto"}
      />

    </form>
  )
}
