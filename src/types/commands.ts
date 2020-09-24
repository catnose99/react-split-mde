export type CommandOption = {
  line: string
  value: string
  code: string
  start: number
  end: number
  composing: boolean
}

export const EnterKey = 'Enter'

export const TabKey = 'Tab'

export type Command = (target: HTMLTextAreaElement, option: CommandOption) => boolean