import {useMemo} from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import "react-circular-progressbar/dist/styles.css"

export default function BudgetTracker() {

  const {state, dispatch, totalExpenses, remainingBudget} = useBudget()

	const percentage =  +((totalExpenses / state.budget) * 100).toFixed(0)

  const graphicColor = useMemo(()=> `${percentage < 90 ? "#3b82f6" : "#db2777"}`, [state.expenses]) 

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
      
      <div className="flex justify-center">

        <CircularProgressbar
      		value={percentage}
      		styles={buildStyles({
      			pathColor: graphicColor,
      			trailColor: "#f5f5f5",
            textSize: 10,
            textColor: graphicColor
      		})}
          text={`${percentage}% Gastado`}
    		/>
      </div>
      
      <div className=" flex flex-col justify-center items-center gap-8">
        <button
          type="button"
          className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
          onClick={()=>dispatch({
            type:'restart-app'
          })}
        >
          resetear app
        </button>

        <AmountDisplay label="Presupuesto" amount={state.budget} />
        <AmountDisplay label="Disponible" amount={remainingBudget}/>
        <AmountDisplay label="Gastado" amount={totalExpenses}/>

      </div>

    </div>
  )
}
