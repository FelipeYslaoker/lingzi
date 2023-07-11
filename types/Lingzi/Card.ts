export interface LingziNote {
  message: string
  type: 'info' | 'warning' | 'error'
  showInFront: boolean
}

export interface LingziCardsQuantity {
  category: string,
  newQuantity: number
  learningQuantity: number
  dueQuantity: number
  totalQuantity: number
}

export interface LingziCardContent {
	front: string
	back: string
	difficulty?: number
	interval?: number
	easinessFactor?: number
	reviewedAt?: string | number
	correctResponses?: number
	consecutiveResponses?: number
}

export interface LingziCard {
  type?: 'example' | 'target'
  id?: string
  front?: string
  back?: string
  target?: LingziCardContent
  example?: LingziCardContent
  language: string
  notes?: LingziNote[]
  category: string
  difficulty?: number
	interval?: number
	easinessFactor?: number
	reviewedAt?: string | number
	correctResponses?: number
	consecutiveResponses?: number
}
