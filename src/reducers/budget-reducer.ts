import { Category, DraftExpense, Expense } from "../types"
import {v4 as uuidv4} from 'uuid'

// actions
export type BudgetActions = 
{ type: 'add-budget', payload: { budget: number } } |
{ type: 'show-modal' } |
{ type: 'close-modal'} |
{ type: 'add-expense', payload:{draftExpense: DraftExpense}} |
{ type: 'remove-expense', payload:{ id:Expense['id']}} |
{ type: 'get-expense-by-id', payload: {id: Expense['id']}} |
{ type: 'uptade-expense', payload: {expense: Expense}} |
{ type: 'restart-app'} |
{ type: 'add-filter-category', payload:{ id: Category['id'] } }


//state
export type BudgetState = {
    budget: number
    modal: boolean
    expenses: Expense[],
    editingId: Expense['id'],
    currentCategory: Category['id']
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
    editingId: "",
    currentCategory: ""
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
        const newState:BudgetState = {
            ...state,
            budget: action.payload.budget
        }
        return newState
    }

    if(action.type === 'show-modal'){
        const newState:BudgetState = {
            ...state,
            modal: true
        }
        return newState
    }

    if(action.type === 'close-modal'){
        const newState:BudgetState = {
            ...state,
            editingId: "",
            modal: false

        }
        return newState
    }

    if(action.type === 'add-expense'){
        const newState:BudgetState = {
            ...state,
            expenses: [...state.expenses, createExpense(action.payload.draftExpense)],
            modal: false
        }
        return newState
    }

    if(action.type === 'remove-expense'){
        const newState:BudgetState = {
            ...state,
            expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
        }
        return newState
    }

    if(action.type === 'get-expense-by-id'){
        const newState:BudgetState = {
            ...state,
            editingId: action.payload.id,
            modal: true
        }
        return newState
    }

    if( action.type === 'uptade-expense'){
        const newState:BudgetState ={
            ...state,
            expenses: state.expenses.map(expense => expense.id === action.payload.expense.id ? action.payload.expense : expense ),
            editingId: "",
            modal: false
        }
        return newState
    }

    if(action.type === 'restart-app'){
        const newState:BudgetState = {
            ...state,
            budget: 0,
            expenses: []
        }
        return newState
    }

    if(action.type === 'add-filter-category'){
        const newState:BudgetState = {
            ...state,
            currentCategory: action.payload.id
        }
        return newState
    }

    return state

}