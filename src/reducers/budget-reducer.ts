import { DraftExpense, Expense } from "../types"
import {v4 as uuidv4} from 'uuid'

// actions
export type BudgetActions = 
{ type: 'add-budget', payload: { budget: number } } |
{ type: 'show-modal' } |
{ type: 'close-modal'} |
{ type: 'add-expense', payload:{draftExpense: DraftExpense}}


//state
export type BudgetState = {
    budget: number
    modal: boolean
    expenses: Expense[]
}

// initial state
export const initialState: BudgetState = {
    budget: 0,
    modal:false,
    expenses: []
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

    return state

}