import { Play } from 'phosphor-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  TaskInput,
  StartCountdownButton
} from './styles'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  });

  
  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

  function handleCreateNewCycle(data: any) {
    const newCycle : Cycle = {
      id: String(new Date().getTime()),
      minutesAmount: data.minutesAmount,
      task: data.task

    }

    setActiveCycleId(String(new Date().getTime()))

    // quando uma alteracao de estado depende do valor anterior utilizar arrow function
    setCycles((state) => [...state, newCycle]) 

    reset() // So reseta caso eu coloca os defaultValues (linha 16)
  }

  const task = watch('task');
  const isSubmitDisabled = !task // Variavel auxiliar para melhorar a legibilidade do codigo

  
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
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
            {...register('minutesAmount', { valueAsNumber: true })}

          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}