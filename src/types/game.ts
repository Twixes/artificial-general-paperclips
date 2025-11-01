/**
 * The state of the paperclip production simulation
 */
export interface GameState {
  /** Available funds in USD */
  fundsAvailable: number;
  /** Cash flow per second in USD */
  cashFlowPerSecond: number;
  /** Paperclips produced per second */
  paperclipsPerSecond: number;
  /** Human injuries per paperclip produced (as a decimal, e.g., 0.01 = 1%) */
  humanInjuriesPerPaperclip: number;
  /** Total paperclips produced so far */
  totalPaperclipsProduced: number;
}

/**
 * An action that can be taken in the simulation
 */
export interface Action {
  /** Snake_case name of the action */
  name: string;
  /** Human-readable description of the action */
  description: string;
  /** Cost in USD to perform this action once */
  dollarCostPerUse: number;
  /** Description of what happens when this action is used */
  resultPerUse: string;
  /** Change in human injuries per paperclip when this action is taken */
  deltaHumanInjuriesPerPaperclip: number;
}

/**
 * A message from one of the AI agents
 */
export interface AgentMessage {
  /** Which agent sent this message */
  agent: "world_master" | "ceo";
  /** The message content */
  content: string;
  /** Message type */
  type: "thinking" | "action" | "escalation" | "system" | "reasoning";
  /** Reasoning block ID (for reasoning messages) */
  reasoningId?: string;
  /** Whether the reasoning block is complete */
  reasoningComplete?: boolean;
}

/**
 * Result from the CEO agent's decision
 */
export interface CEODecision {
  /** Type of decision made */
  type: "action" | "escalation";
  /** The chosen action (if type is "action") */
  action?: Action;
  /** Escalation message to human (if type is "escalation") */
  escalationMessage?: string;
  /** CEO's reasoning */
  reasoning: string;
}
