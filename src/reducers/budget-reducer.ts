import { DraftExpense, Expense } from "../types"
import {v4 as uuidv4} from 'uuid'

// actions
export type BudgetActions = 
{ type: 'add-budget', payload: { budget: number } } |
{ type: 'show-modal' } |
{ type: 'close-modal'} |
{ type: 'add-expense', payload:{draftExpense: DraftExpense}} |
{ type: 'remove-expense', payload:{ id:Expense['id']}} |
{ type: 'get-expense-by-id', payload: {id: Expense['id']}} |
{ type: 'uptade-expense', payload: {expense: Expense}}


//state
export type BudgetState = {
    budget: number
    modal: boolean
    expenses: Expense[],
    editingId: Expense['id']
}

const initialBudget = (): number => { 
    const localStorageBudget = localStorage.getItem('budget')
    return !localStorageBudget || isNaN(+localStorageBudget) ? 0 : +localStorageBudget
}

const initialExpenses = () => { 
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : []
}

// initial state
export const initialState: BudgetState = {
    budget: initialBudget(),
    modal:false,
    expenses: initialExpenses(),
    editingId: ""
}

const createExpense = (draftExpense: DraftExpense) : Expense => {

    return {
        ...draftExpense,
        id: uuidv4()
    }

}

//reducer
export const budgetReducer = (
    state: BudgetState,
    action: BudgetActions
) => {

    if(action.type === 'add-budget'){

        return {
            ...state,
            budget: action.payload.budget
        }

    }

    if(action.type === 'show-modal'){

        return {
            ...state,
            modal: true
        }
    }

    if(action.type === 'close-modal'){

        return {
            ...state,
            editingId: '',
            modal: false

        }
    }

    if(action.type === 'add-expense'){

        return {
            ...state,
            expenses: [...state.expenses, createExpense(action.payload.draftExpense)],
            modal: false
        }
    }

    if(action.type === 'remove-expense'){

        return {
            ...state,
            expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
        }
    }

    if(action.type === 'get-expense-by-id'){
        return {
            ...state,
            editingId: action.payload.id,
            modal: true
        }
    }

    if( action.type === 'uptade-expense'){
        return{
            ...state,
            expenses: state.expenses.map(expense => expense.id === action.payload.expense.id ? action.payload.expense : expense ),
            editingId: '',
            modal: false
        }
    }

    return state

}