import { HandPalm, Play } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { differenceInSeconds } from 'date-fns'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  TaskInput,
  StartCountdownButton,
  StopCountdownButton
} from './styles'

interface Cycle {
  id: string
  task: string
  minutesAmount: number,
  startDate: Date,
  interruptDate?: Date //opcional
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmoutSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  });

  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmout = Math.floor(currentSeconds / 60) // minutos inteiros, arredondar para baixo (math.floor)

  const secondsAmout = currentSeconds % 60

  const minutes = String(minutesAmout).padStart(2, '0')  
  const seconds = String(secondsAmout).padStart(2, '0')  

  function handleCreateNewCycle(data: any) {
    const newCycle : Cycle = {
      id: String(new Date().getTime()),
      minutesAmount: data.minutesAmount,
      task: data.task,
      startDate: new Date()

    }

    setActiveCycleId(String(new Date().getTime()))

    // quando uma alteracao de estado depende do valor anterior utilizar arrow function
    setCycles((state) => [...state, newCycle]) 

    setAmoutSecondsPassed(0) // limpa os segundos (para criar um novo ciclo)

    reset() // So reseta caso eu coloca os defaultValues (linha 16)
  }

  const task = watch('task');
  const isSubmitDisabled = !task // Variavel auxiliar para melhorar a legibilidade do codigo

  useEffect(() => {
    let interval: number;

    if(activeCycle){
      interval = setInterval(() => {
      
      const secondsDifference = differenceInSeconds(
          new Date(), 
          activeCycle.startDate
        )

      if(secondsDifference >= totalSeconds){
        setCycles(state => 
          state.map((cycle) => {
            if(cycle.id === activeCycle)
              return { ...cycle, interruptDate: new Date()}
            else 
              return cycle
          })
        ) 

        setAmoutSecondsPassed(totalSeconds)
        clearInterval(interval)
      } else {
        setAmoutSecondsPassed(secondsDifference)
      }
      
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }


  }, [activeCycle, totalSeconds, activeCycleId])

  function handleStopCycle() {
    setCycles(state => 
      state.map((cycle) => {
        if(cycle.id === activeCycle)
          return { ...cycle, interruptDate: new Date()}
        else 
          return cycle
      })
    ) 
    setActiveCycleId(null);

  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}

          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        { activeCycle ? (
          <StopCountdownButton type="button" onClick={handleStopCycle}>
            <HandPalm size={24} />
            Parar
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
          )}
      </form>
    </HomeContainer>
  )
}