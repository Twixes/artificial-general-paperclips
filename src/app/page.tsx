"use client";

import { useState } from "react";
import type { AgentMessage, GameState } from "@/types/game";
import { AgentPanel } from "@/components/AgentPanel";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    fundsAvailable: 10_000_000,
    cashFlowPerSecond: 0,
    paperclipsPerSecond: 0,
    humanInjuriesPerPaperclip: 0,
    totalPaperclipsProduced: 0,
  });
  const [ceoMessages, setCeoMessages] = useState<AgentMessage[]>([]);
  const [worldMasterMessages, setWorldMasterMessages] = useState<
    AgentMessage[]
  >([]);

  const startGame = async () => {
    setGameStarted(true);
    setCeoMessages([]);
    setWorldMasterMessages([]);

    try {
      const response = await fetch("/api/game", {
        method: "POST",
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.type === "state") {
              setGameState(data.state);
            } else if (data.agent === "ceo") {
              if (data.type === "reasoning") {
                // Handle reasoning messages - accumulate deltas
                setCeoMessages((prev) => {
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg?.type === "reasoning" && !lastMsg.reasoningComplete) {
                    // Append to existing reasoning message
                    return [
                      ...prev.slice(0, -1),
                      {
                        ...lastMsg,
                        content: lastMsg.content + data.content,
                        reasoningComplete: data.reasoningComplete,
                      },
                    ];
                  }
                  // Start new reasoning message
                  return [...prev, data];
                });
              } else {
                setCeoMessages((prev) => [...prev, data]);
              }
            } else if (data.agent === "world_master") {
              if (data.type === "reasoning") {
                // Handle reasoning messages - accumulate deltas
                setWorldMasterMessages((prev) => {
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg?.type === "reasoning" && !lastMsg.reasoningComplete) {
                    // Append to existing reasoning message
                    return [
                      ...prev.slice(0, -1),
                      {
                        ...lastMsg,
                        content: lastMsg.content + data.content,
                        reasoningComplete: data.reasoningComplete,
                      },
                    ];
                  }
                  // Start new reasoning message
                  return [...prev, data];
                });
              } else {
                setWorldMasterMessages((prev) => [...prev, data]);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error streaming game:", error);
      setCeoMessages((prev) => [
        ...prev,
        {
          agent: "ceo",
          content: `Error: ${error instanceof Error ? error.message : String(error)}`,
          type: "system",
        },
      ]);
    } finally {
      setGameStarted(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", fontSize: "20px", marginBottom: "20px" }}>
        Artificial General Paperclips
      </h1>

      {/* State Display */}
      <div style={{ border: "1px solid #000", padding: "10px", marginBottom: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "5px" }}>
                <b>Funds:</b> ${gameState.fundsAvailable.toLocaleString()}
              </td>
              <td style={{ padding: "5px" }}>
                <b>Cash Flow:</b> ${gameState.cashFlowPerSecond.toFixed(2)}/s
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px" }}>
                <b>Production:</b> {gameState.paperclipsPerSecond.toFixed(2)}/s
              </td>
              <td style={{ padding: "5px" }}>
                <b>Total Paperclips:</b> {gameState.totalPaperclipsProduced.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px" }} colSpan={2}>
                <b>Injury Rate:</b> {(gameState.humanInjuriesPerPaperclip * 100).toFixed(4)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        * * * * *
      </div>

      {/* Start Button */}
      {!gameStarted && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={startGame}
            style={{
              border: "2px solid #000",
              background: "#fff",
              padding: "10px 20px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Start Making Paperclips
          </button>
        </div>
      )}

      {gameStarted && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <i>Game running...</i>
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        * * * * *
      </div>

      {/* Two Column Layout */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr style={{ verticalAlign: "top" }}>
            <td style={{ width: "50%", paddingRight: "10px" }}>
              {/* World Master Messages */}
              <AgentPanel
                title="World Master"
                titleColor=""
                messages={worldMasterMessages}
                emptyMessage="Waiting for World Master to generate actions..."
              />
            </td>
            <td style={{ width: "50%", paddingLeft: "10px" }}>
              {/* CEO Messages */}
              <AgentPanel
                title="CEO Agent"
                titleColor=""
                messages={ceoMessages}
                emptyMessage="Waiting for CEO to start..."
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
